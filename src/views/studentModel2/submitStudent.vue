<template>
  <div>
    <el-card class="my_card">
      <!-- 非正常跳转到当前页 -->
      <div v-if="!route.params.type">
        <el-empty :image-size="200" description="访问错误，请从正常路径跳转" />
      </div>
      <!-- 正常途径跳转 -->
      <div v-else>
        <div class="stu_form">
          <!-- 增加 -->
          <div v-if="route.params.type === 'add'">
            <div class="title">
              {{ titleType.AddStudent }}
            </div>
            <el-form ref="addStuFormRef" :model="addState.stuForm" :rules="addStuFormRule">
              <el-form-item label="姓名" prop="StudentName">
                <el-input v-model="addState.stuForm.StudentName" maxlength="30" style="width: 200px; margin-right: 10px"
                  clearable placeholder="请输入学生学号" />
              </el-form-item>
              <el-form-item label="学号" prop="StudentNumber">
                <el-input v-model="addState.stuForm.StudentNumber" maxlength="30" style="width: 200px; margin-right: 10px"
                  clearable placeholder="请输入学生学号" />
              </el-form-item>
              <el-form-item label="性别" prop="Sex">
                <el-radio-group v-model="addState.stuForm.Sex" class="ml-4">
                  <el-radio label="男" size="large">男</el-radio>
                  <el-radio label="女" size="large">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="选择班级" prop="ClassID">
                <el-select v-model="addState.stuForm.ClassID" class="m-2" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="所属班级">
                  <el-option v-for="item in addState.classList" :key="item.ClassID" :label="item.ClassName"
                    :value="item.ClassID" />
                </el-select>
              </el-form-item>

              <el-form-item label="选择学院" prop="CollegeID">
                <el-select v-model="addState.stuForm.CollegeID" class="m-2" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="所属学院">
                  <el-option v-for="item in addState.collegeList" :key="item.CollegeID" :label="item.CollegeName"
                    :value="item.CollegeID" />
                </el-select>
              </el-form-item>
            </el-form>

          </div>

          <!-- 修改 -->
          <div v-else-if="route.params.type === 'update'">
            <div class="title">
              {{ titleType.EditStudent }}
            </div>
            <el-form ref="updateStuFormRef" :model="updateState.stuForm" :rules="updateStuFormRule">
              <el-form-item label="姓名" prop="StudentName">
                <el-input v-model="updateState.stuForm.StudentName" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="请输入学生学号" />
              </el-form-item>
              <el-form-item label="学号" prop="StudentNumber">
                <el-input v-model="updateState.stuForm.StudentNumber" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="请输入学生学号" disabled="true" />
              </el-form-item>
              <el-form-item label="性别" prop="Sex">
                <el-radio-group v-model="updateState.stuForm.Sex" class="ml-4">
                  <el-radio label="男" size="large">男</el-radio>
                  <el-radio label="女" size="large">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="选择班级" prop="ClassID">
                <el-select v-model="updateState.stuForm.ClassID" class="m-2" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="所属班级">
                  <el-option v-for="item in updateState.classList" :key="item.ClassID" :label="item.ClassName"
                    :value="item.ClassID" />
                </el-select>
              </el-form-item>

              <el-form-item label="选择学院" prop="CollegeID">
                <el-select v-model="updateState.stuForm.CollegeID" class="m-2" maxlength="30"
                  style="width: 200px; margin-right: 10px" clearable placeholder="所属学院">
                  <el-option v-for="item in updateState.collegeList" :key="item.CollegeID" :label="item.CollegeName"
                    :value="item.CollegeID" />
                </el-select>
              </el-form-item>
              <el-form-item label="电话" prop="StudentNumber">
                <el-input v-model="updateState.stuForm.Mobile" maxlength="30" style="width: 200px; margin-right: 10px"
                  clearable placeholder="请输入电话" />
              </el-form-item>
              <el-form-item label="邮箱" prop="StudentNumber">
                <el-input v-model="updateState.stuForm.Email" maxlength="30" style="width: 200px; margin-right: 10px"
                  clearable placeholder="请输入邮箱" />
              </el-form-item>
            </el-form>
          </div>
        </div>


        <!-- 按钮部分 -->
        <div class="btns">
          <el-button class="btn" type="primary" @click="goBack">返回</el-button>
          <el-button class="btn" type="primary"
            @click="submitForm(route.params.type === 'add' ? addStuFormRef : updateStuFormRef)">提交</el-button>

        </div>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { ElMessage, type FormInstance } from 'element-plus';
import { Session } from '/@/utils/storage';

import { useStudentApi } from '/@/api/students/index';
import { useCollegeApi } from '/@/api/college/index';
import { useClassApi } from '/@/api/class/index';

// 类型定义引用
import { StudentsInfosState, AddStudentsParams, UpdateStudentsParams } from '/@/api/students/type';
import { CollegesInfosState } from '/@/api/college/type';
import { ClassInfoState } from '/@/api/class/type';

import { useRoute } from 'vue-router';
import router from '/@/router';
const route = useRoute()

// 当前页面的标题
const titleType = reactive({
  AddStudent: '增加学生',
  EditStudent: '修改学生',
})

// 添加 类型定义，自行修改设置
interface AddState {
  stuForm: AddStudentsParams;
  collegeList: Array<CollegesInfosState>;
  classList: Array<ClassInfoState>;
}
// 添加数据
const addState = reactive<AddState>({
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

// 修改 类型定义，自行修改设置
interface UpdateState {
  stuForm: UpdateStudentsParams;
  collegeList: Array<CollegesInfosState>;
  classList: Array<ClassInfoState>;
}
// 修改数据
const receivedStuDataString = route.params.StuData as string;
const stuData = route.params.StuData ? JSON.parse(receivedStuDataString) as StudentsInfosState : null;

const updateState = reactive<UpdateState>({
  stuForm: {
    CollegeID: stuData?.CollegeID ?? null,
    ClassID: stuData?.ClassID ?? null,
    StudentName: stuData?.StudentName ?? '',
    StudentNumber: stuData?.StudentNumber ? Number(stuData.StudentNumber) : null,
    Sex: stuData?.Sex ?? '',
    Mobile: stuData?.Mobile,
    Email: stuData?.Email,

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
  const params = {
    Page: 1,
    Size: 999,
  };
  fetchCollege
    .getColleges(params)
    .then((res: { data: Array<CollegesInfosState> }) => {
      addState.collegeList = res.data;
      updateState.collegeList = res.data;

    })
    // eslint-disable-next-line no-unused-vars
    .catch((err: any) => {
      addState.collegeList = [];
      updateState.collegeList = [];

    });
};
const getClassList = () => {
  const params = {
    Page: 1,
    Size: 999,
  };
  fetchClass
    .getClass(params)
    .then((res: { data: Array<ClassInfoState> }) => {
      addState.classList = res.data;
      updateState.classList = res.data;
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err: any) => {
      addState.classList = [];
      updateState.classList = [];
    });
};

// 添加学生  定义表单验证规则,后面根据需要，提取到统一的文件
const addStuFormRef = ref<FormInstance>();
const addStuFormRule = {
  StudentName: [{ required: true, message: '请填写姓名', trigger: 'change' }],
  StudentNumber: [{ required: true, message: '请填写学号', trigger: 'change' }],
  Sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  ClassID: [{ required: true, message: '请选择班级', trigger: 'change' }],
  CollegeID: [{ required: true, message: '请选择班级', trigger: 'change' }],
};

// 定义表单验证规则
const updateStuFormRef = ref<FormInstance>();
const updateStuFormRule = {
  StudentName: [{ required: true, message: '请填写姓名', trigger: 'change' }],
  StudentNumber: [{ required: true, message: '请填写学号', trigger: 'change' }],
  Sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  ClassID: [{ required: true, message: '请选择班级', trigger: 'change' }],
  CollegeID: [{ required: true, message: '请选择班级', trigger: 'change' }],
  Mobile: [{ required: true, message: '请填写手机', trigger: 'change' }],
  Email: [{ required: true, message: '请填写邮箱', trigger: 'change' }],
};

// 添加学生接口调用
const fetchStudent = useStudentApi();
const useAddFormApi = () => {
  fetchStudent
    .addStudents(addState.stuForm)
    .then((res: any) => {
      if (res.code === '2000') {
        router.go(-1)
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

// 修改学生接口调用
const useUpdateFormApi = () => {
  fetchStudent
    .updateStudents(stuData.StudentID, updateState.stuForm)
    .then((res: any) => {
      if (res.code === '2000') {
        router.go(-1)
        ElMessage({
          message: '修改成功！',
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

// 提交表单，
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (route.params.type === 'add') {
        addState.stuForm.Account = String(addState.stuForm.StudentNumber);
        addState.stuForm.Password = String(addState.stuForm.StudentNumber);
        useAddFormApi();
      } else if (route.params.type === 'update') {
        useUpdateFormApi();
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 返回列表页
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  getClassList();
  getCollegeList();
});
</script>

<style scoped>
.my_card {
  min-height: 80vh;
  position: relative;
}

.my_card .stu_form .title {
  font-size: 20px;
  margin-bottom: 20px;
}

.my_card .btns {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
</style>