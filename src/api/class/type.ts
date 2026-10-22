// 接口接收参数类型定义
// 获取班级列表
export interface GetClassParams {
  Page?: number, // 页码
	Size?: number, // 每页数量
}

// 接口返回参数类型定义
export interface ClassInfoState {
  ClassID?: number;       // 班级编号
  ClassName?: string;     // 班级名称
  CollegeID?: number;     // 所属学院编号
  CollegeName?: string;   // 所属学院名称
  IsDelete?: number;      // 是否删除
  CreateTime?: string;    // 创建时间
}