<template>
	<div>
		<el-card class="box-card">
			<template #header>
				<el-input v-model="state.searchStduentForm.StudentNumber" maxlength="30" style="width: 200px; margin-right: 10px"
					clearable placeholder="请输入学生学号" @change="searchStuFun1()" />
				<el-select v-model="state.searchStduentForm.CollegeID" class="m-2" maxlength="30"
					style="width: 200px; margin-right: 10px" clearable placeholder="所属学院">
					<el-option v-for="item in state.collegeList" :key="item.CollegeID" :label="item.CollegeName"
						:value="item.CollegeID" />
				</el-select>
				<el-button type="primary" @click="searchStuFun1()">查询</el-button>
				<el-button class="add_btn" type="primary" @click="addStudent()">添加</el-button>
			</template>
			<el-table ref="multipleTable" v-loading="state.loading" :data="state.StudentList" tooltip-effect="dark"
				style="width: 100%">
				<el-table-column prop="StudentNumber" label="学号" align="center" header-align="center" width="210px" />
				<el-table-column prop="StudentName" label="学生姓名" align="center" header-align="center" width="150px" />
				<el-table-column prop="Account" label="登录账号" align="center" header-align="center" width="200px" />
				<el-table-column prop="CollegeName" label="所属学院" align="center" header-align="center" width="200px" />
				<el-table-column prop="ClassName" label="班级" align="center" header-align="center" width="150px" />
				<el-table-column prop="Sex" label="性别" align="center" header-align="center" width="80px" />
				<el-table-column prop="Mobile" label="联系方式" align="center" header-align="center" min-width="235px" />
				<el-table-column fixed="right" label="操作" header-align="center" align="center" width="300px">
					<template #default="scope">
						<!-- 修改学生资料 -->
						<div class="danger">
							<el-popover placement="top-start" trigger="hover" content="修改资料">
								<template #reference>
									<el-button type="primary" :icon="Edit" @click="editStudent(scope.row)"> </el-button>
								</template>
							</el-popover>
						</div>
						<!-- 删除学生 -->
						<div class="danger">
							<el-popover placement="top-start" trigger="hover" content="删除">
								<template #reference>
									<el-button type="danger" :icon="Delete" @click="deleteStudent(scope.row)"> </el-button>
								</template>
							</el-popover>
						</div>
					</template>
				</el-table-column>
			</el-table>

			<!--总数超过一页，再展示分页器-->
			<el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
				:page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
		</el-card>

	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useStudentApi } from '/@/api/students/index';
import { useCollegeApi } from '/@/api/college/index';
import { Session } from '/@/utils/storage';

// 类型引用定义
import { StudentsInfosState, GetStudentsParams, SearchStudentsParams, DelStudentsParams } from '/@/api/students/type';
import { CollegesInfosState } from '/@/api/college/type';

import { Delete, Edit } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { useRouter } from 'vue-router';
const router = useRouter()

const fetchStudent = useStudentApi();
const fetchCollege = useCollegeApi();

// 类型定义，自行修改设置
interface State {
	loading: boolean;
	StudentList: Array<StudentsInfosState>;
	collegeList: Array<CollegesInfosState>;
	searchStduentForm: SearchStudentsParams;
	total: number;
	currentPage: number;
	pageSize: number;
}

const state = reactive<State>({
	loading: false, // 是否加载中的状态，默认为 false
	StudentList: [], // 学生列表，默认为空数组
	collegeList: [], // 学院列表，默认为空数组
	searchStduentForm: {
		// 搜索学生的表单对象
		StudentName: '', // 学生姓名，默认为空字符串
		StudentNumber: '', // 学生学号，默认为空字符串
		CollegeID: null, // 学院ID，默认为空字符串
	},
	total: 0, // 数据总条数，默认为 0
	currentPage: 1, // 当前页码，默认为 1
	pageSize: 10, // 每页显示条数，默认为 10
});

// 获取学院列表
const getCollegeList = () => {
	const params = {
		Page: state.currentPage,
		Size: 999,
	};
	fetchCollege
		.getColleges(params)
		.then((res) => {
			state.collegeList = res.data;
		})
		.catch((err) => {
			state.collegeList = [];
			console.log(err);
		});
	state.loading = false;
};

// 获取学生列表
const getStudentList = () => {
	let params: GetStudentsParams = {
		Page: state.currentPage,
		Size: state.pageSize,
		UserID: Session.get('userInfo').sysUserID,
		UserType: 3, // 登录接口未返回，接口文档 3 管理员类型

		// 查询时的参数
		StudentNumber: state.searchStduentForm.StudentNumber,
	};

	if (state.searchStduentForm.CollegeID) {
		params.CollegeID = state.searchStduentForm.CollegeID; // 放在上面，初次加载时，如果为空时会报错，所以判断是否是查询然后再赋值
	}
	fetchStudent
		.getStudents(params)
		.then((res) => {
			state.StudentList = res.data;
			state.total = res.count;
		})
		.catch((err) => {
			console.log('StudentList', err);
			state.StudentList = [];
		});
	state.loading = false;
};
// 查询学生，方式一，通过学生列表的接口, 输入学生学号之后，鼠标在文本框脱标之后执行，也可以点击查询执行
const searchStuFun1 = () => {
	state.currentPage = 1;
	getStudentList();
};

// 单独的学生信息查询接口调用，这里要查询使用的是StudentID，
// const searchtStudent = (stuID: number) => {
// 	const params = {
// 		CollegeID: state.searchStduentForm.CollegeID,
// 		UserID: Session.get('userInfo').sysUserID,
// 		UserType: 3, // 登录接口未返回，接口文档 3 管理员类型
// 	};
// 	fetchStudent
// 		.searchStudents(stuID, params)
// 		.then((res) => {
// 			if (res.code !== '2000') {
// 				alert(res.error);
// 				state.currentPage = 1;
// 				getStudentList();
// 			} else {
// 				state.StudentList = [];
// 				state.StudentList.push(res.data);
// 				state.total = 1;
// 			}
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 			state.StudentList = [];
// 		});
// 	state.loading = false;
// };
// 查询学生，方式二，通过具体的学生查询接口，备选项，两种方式都可以查询，自行选择，目前没有绑定事件，可以自行测试

// const searchStuFun2 = () => {
// 	state.currentPage = 1;
// 	// 注意，此处输入框要输入的是学生的StudentID ,
// 	if (state.searchStduentForm.StudentNumber && state.searchStduentForm.CollegeID) {
// 		searchtStudent(Number(state.searchStduentForm.StudentNumber));
// 	} else {
// 		alert('学院信息不能为空');
// 	}
// };
// 修改学生信息

// 修改学生
const editStudent = (stuData: StudentsInfosState) => {
	const stuDataString = JSON.stringify(stuData);
	router.push({
		name: "submitStudent",
		params: {
			type: "update",
			StuData: stuDataString
		}
	})
};
// 删除学生
const deleteStudent = (stuData: StudentsInfosState) => {
	const params: DelStudentsParams = {
		CollegeID: stuData.CollegeID,
		UserID: Session.get('userInfo').sysUserID,
		UserType: 3, // 登录接口未返回，接口文档 3 管理员类型
	};
	ElMessageBox.confirm(`确认删除 ${stuData.StudentName} 吗 `, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			fetchStudent
				.delStudents(stuData.StudentID, params)
				.then((res) => {
					if (res.code !== '2000') {
						alert(res.error);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					state.currentPage = 1;
					getStudentList();
				});
			ElMessage({
				type: 'success',
				message: '删除成功！',
			});
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '删除失败!',
			});
		});

	state.loading = false;
};

// 增加学生
const addStudent = () => {
	router.push({
		name: "submitStudent",
		params: {
			type: "add",
			stuData: {} as any
		}
	})
};

const changePage = (val: any) => {
	state.currentPage = val;
	getStudentList();
};

onMounted(() => {
	getStudentList();
	getCollegeList();
});
</script>

<style scoped lang="scss">
.primary {
	float: left;
	color: rgb(27, 174, 174);
	font-size: 20px;
	margin-left: 50px;
	margin-right: 5px;
}

.danger {
	float: left;
	font-size: 20px;
	margin-left: 0px;
	margin-right: 5px;
}

.add_btn {
	float: right;
}
</style>
