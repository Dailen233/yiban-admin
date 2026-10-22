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
			<el-scrollbar height="700px" ref="scrollbarRef" @scroll.native="scroll">
				<el-table ref="multipleTable" v-loading="state.loading" :data="state.StudentList" tooltip-effect="dark"
					style="width: 100%">
					<el-table-column label="序号" align="center" header-align="center" width="100px" type="index" />
					<el-table-column prop="StudentNumber" label="学号" align="center" header-align="center" width="210px" />
					<el-table-column prop="StudentName" label="学生姓名" align="center" header-align="center" width="150px" />
					<el-table-column prop="Account" label="登录账号" align="center" header-align="center" width="200px" />
					<el-table-column prop="CollegeName" label="所属学院" align="center" header-align="center" width="200px" />
					<el-table-column prop="ClassName" label="班级" align="center" header-align="center" width="150px" />
					<el-table-column prop="Sex" label="性别" align="center" header-align="center" width="60px" />
					<el-table-column prop="Mobile" label="联系方式" align="center" header-align="center" min-width="235px" />
					<el-table-column fixed="right" label="操作" header-align="center" align="center" width="300px">
						<template #default="scope">
							<div class="btnItem">
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
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>


			<!--总数超过一页，再展示分页器-->
			<div class="loadMore">
				<span @click="loadMore">
					{{ state.loading ? '加载中...' : (state.StudentList.length === state.total ? '已全部加载' : '加载更多...') }}
				</span>
			</div>
		</el-card>

	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useStudentApi } from '/@/api/students/index';
import { useCollegeApi } from '/@/api/college/index';
import { Session } from '/@/utils/storage';

// 类型定义引用
import { StudentsInfosState, GetStudentsParams, SearchStudentsParams, DelStudentsParams } from '/@/api/students/type';
import { CollegesInfosState } from '/@/api/college/type';

import { Delete, Edit } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElScrollbar, ElTable } from 'element-plus';

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
	stepSize: number;
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
	currentPage: 1, // 当前页码，永远是 1
	stepSize: 10, // 每次加载增加的数据数量，默认为 10
	pageSize: 11, // 当前请求加载的数量，默认为 10
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

// 加载更多学生
const loadMore = () => {
	// 模拟加载更多数据的操作
	if (!state.loading && state.StudentList.length < state.total) {
		state.loading = true;
		state.pageSize += state.stepSize
		setTimeout(() => {
			getStudentList()

		}, 500)
	}
};

// 滚动加载表格内容
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const multipleTable = ref<InstanceType<typeof ElTable>>()
const lastScrollTop = ref(0); // 记录上一次滚动条的位置
const lastLoadTime = ref(0); // 记录上一次加载更多的时间戳
const loadInterval = 500; // 规定的加载更多的时间间隔
// 滚动条监听
const scroll = (target) => {
	if (scrollbarRef.value && multipleTable.value?.$el) {
		const scrollbar = scrollbarRef.value.$el;
		const table = multipleTable.value.$el;
		const isAtBottom = target.scrollTop + scrollbar.clientHeight >= table.clientHeight;

		if (isAtBottom && Date.now() - lastLoadTime.value >= loadInterval) {
			lastScrollTop.value = target.scrollTop;
			// 移动滚动条到触底之前的位置
			scrollbarRef.value.scrollTo({
				top: lastScrollTop.value - 1,
				behavior: 'auto', // 使用 'auto' 表示不使用平滑滚动效果
			});
			// 记录加载更多的时间戳
			lastLoadTime.value = Date.now();
			// 加载更多数据
			loadMore();
		}
	}
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

.btnItem {
	font-size: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.danger {
	// float: left;
	// margin-left: 0px;
	// margin-right: 5px;
}

.add_btn {
	float: right;
}

.loadMore {
	font-size: 16px;
	width: 100%;
}

.loadMore span {
	display: block;
	width: 100px;
	margin: 0 auto;
	margin-top: 10px;
}

.loadMore span:hover {
	cursor: pointer;
}
</style>
