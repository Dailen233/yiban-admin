// 接口接收参数类型定义

// 获取学生列表
export interface GetStudentsParams {
	Page?: number, // 页码
	Size?: number, // 每页数量

	UserID?: number; //用户编号，操作者
	UserType?: number; // 用户类型，操作者
	StudentNumber?: string; // 学号
	CollegeID?: string; // 学院ID
}

// 增加学生
export interface AddStudentsParams {
	CollegeID?: number; // 学院编号
	ClassID?: number; // 班级编号
	Account?: string; // 账号
	Password?: string; // 密码
	StudentName?: string; // 学生姓名
	StudentNumber?: number; // 学生学号
	Sex?: string; // 性别

	UserID?: number; // 用户编号，操作者
	UserType?: number; // 用户类型，操作者
}

// 删除学生
export interface DelStudentsParams {
	CollegeID?: number, //学院ID
	UserID?: number, //用户ID
	UserType?: number, //用户类型
}

// 修改学生
export interface UpdateStudentsParams {
	CollegeID?: number; // 学院编号
	ClassID?: number; // 班级编号
	StudentName?: string; // 学生姓名
	StudentNumber?: number; // 学生学号
	Sex?: string; // 性别
	Mobile?: string; // 手机
	Email?: string; // 邮箱

	UserID?: number; // 用户编号，操作者
	UserType?: number; // 用户类型，操作者
}

// 查找学生
export interface SearchStudentsParams {
	StudentName?: string; // 学生姓名
	StudentNumber?: string; //学生学号
	CollegeID?: string; ////学院ID
}



// 接口返回参数类型定义
export interface StudentsInfosState {
	Account?: string;        // 学生账号
	ClassID?: number;        // 班级 ID
	ClassName?: string;      // 班级名称
	CollegeID?: number;      // 学院 ID
	CollegeName?: string;    // 学院名称
	CreateTime?: string;     // 创建时间（字符串形式）
	Email?: string;          // 邮箱地址
	Mobile?: string;         // 手机号码
	OpenID?: string;         // 微信 OpenID
	Sex?: string;            // 性别
	Status?: number;         // 状态（例如，激活/禁用等）
	StudentID?: number;      // 学生 ID
	StudentName?: string;    // 学生姓名
	StudentNumber?: string;  // 学生学号
}