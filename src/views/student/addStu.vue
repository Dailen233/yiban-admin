<template>
	<div>
		<div class="stu_form">
			<el-form ref="stuFormRef" :model="state.stuForm" :rules="stuFormRule">
				<el-form-item label="姓名" prop="StudentName">
					<el-input v-model="state.stuForm.StudentName" maxlength="30" style="width: 200px; margin-right: 10px" clearable
						placeholder="请输入学生学号" />
				</el-form-item>
				<el-form-item label="学号" prop="StudentNumber">
					<el-input v-model="state.stuForm.StudentNumber" maxlength="30" style="width: 200px; margin-right: 10px"
						clearable placeholder="请输入学生学号" />
				</el-form-item>
				<el-form-item label="性别" prop="Sex">
					<el-radio-group v-model="state.stuForm.Sex" class="ml-4">
						<el-radio label="男" size="large">男</el-radio>
						<el-radio label="女" size="large">女</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="选择班级" prop="ClassID">
					<el-select v-model="state.stuForm.ClassID" class="m-2" maxlength="30" style="width: 200px; margin-right: 10px"
						clearable placeholder="所属班级">
						<el-option v-for="item in state.classList" :key="item.ClassID" :label="item.ClassName"
							:value="item.ClassID" />
					</el-select>
				</el-form-item>

				<el-form-item label="选择学院" prop="CollegeID">
					<el-select v-model="state.stuForm.CollegeID" class="m-2" maxlength="30" style="width: 200px; margin-right: 10px"
						clearable placeholder="所属学院">
						<el-option v-for="item in state.collegeList" :key="item.CollegeID" :label="item.CollegeName"
							:value="item.CollegeID" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="cancleForm()">取消</el-button>
					<el-button type="primary" @click="submitForm(stuFormRef)">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { Session } from '/@/utils/storage';

import { useStudentApi } from '/@/api/students/index';
import { useCollegeApi } from '/@/api/college/index';
import { useClassApi } from '/@/api/class/index';

// 类型引用定义
import { AddStudentsParams } from '/@/api/students/type';
import { GetCollegesParams, CollegesInfosState } from '/@/api/college/type';
import { GetClassParams, ClassInfoState } from '/@/api/class/type';


import { ElMessage, type FormInstance } from 'element-plus';

// 类型定义，自行修改设置
interface State {
	stuForm: AddStudentsParams;
	collegeList: Array<CollegesInfosState>;
	classList: Array<ClassInfoState>;
}

const state = reactive<State>({
	stuForm: {
		CollegeID: null,
		ClassID: null,
		Account: '',
		Password: '',
		StudentName: '',
		StudentNumber: null,
		Sex: '',

		UserID: Session.get('userInfo').sysUserID,
		UserType: 3,
	},
	collegeList: [],
	classList: [],
});

// 获取学院，班级列表
const fetchCollege = useCollegeApi();
const fetchClass = useClassApi();
const getCollegeList = () => {
	const params: GetCollegesParams = {
		Page: 1,
		Size: 999,
	};
	fetchCollege
		.getColleges(params)
		.then((res: { data: Array<CollegesInfosState> }) => {
			state.collegeList = res.data;
		})
		// eslint-disable-next-line no-unused-vars
		.catch((err: any) => {
			state.collegeList = [];
		});
};
const getClassList = () => {
	const params: GetClassParams = {
		Page: 1,
		Size: 999,
	};
	fetchClass
		.getClass(params)
		.then((res: { data: Array<ClassInfoState> }) => {
			state.classList = res.data;
		})
		// eslint-disable-next-line no-unused-vars
		.catch((err: any) => {
			state.classList = [];
		});
};

// 定义表单验证规则,后面根据需要，提取到统一的文件
const stuFormRef = ref<FormInstance>();
const stuFormRule = {
	StudentName: [{ required: true, message: '请填写姓名', trigger: 'change' }],
	StudentNumber: [{ required: true, message: '请填写学号', trigger: 'change' }],
	Sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
	ClassID: [{ required: true, message: '请选择班级', trigger: 'change' }],
	CollegeID: [{ required: true, message: '请选择班级', trigger: 'change' }],
};

const fetchStudent = useStudentApi();
const useAddFormApi = () => {
	fetchStudent
		.addStudents(state.stuForm)
		.then((res: any) => {
			if (res.code === '2000') {
				emits('submitChildForm');
				ElMessage({
					message: '添加成功！',
					type: 'success',
				});
			} else {
				ElMessage({
					message: `${res.message}`,
					type: 'error',
				});
			}
		})
		.catch((err: any) => {
			ElMessage({
				message: `${err}`,
				type: 'error',
			});
		});
};

// 组件之间传参
const emits = defineEmits(['cancleChildForm', 'submitChildForm']);
const cancleForm = () => {
	// 触发 取消 事件，通知父组件
	emits('cancleChildForm');
};

// 提交表单，
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			state.stuForm.Account = String(state.stuForm.StudentNumber);
			state.stuForm.Password = String(state.stuForm.StudentNumber);

			useAddFormApi();

			// eslint-disable-next-line no-console
			console.log(state.stuForm);
		} else {
			// eslint-disable-next-line no-console
			console.log('error submit!', fields);
		}
	});
};

onMounted(() => {
	getClassList();
	getCollegeList();
});
</script>
<style scoped>
.stu_form {
	width: 400px;
	margin: 20px auto;
}

.el-button--text {
	margin-right: 15px;
}

.el-select {
	width: 300px;
}

.el-input {
	width: 300px;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
