// 接口接收参数类型定义
// 获取学院列表
export interface GetCollegesParams {
	Page?: number, // 页码
	Size?: number, // 每页数量
}

// 接口返回参数类型定义
export interface CollegesInfosState {
	AutoID?: number;      // 自动编号
	CollegeID?: number;   // 学院编号
	CollegeName?: string; // 学院名称
	CreateTime?: string;  // 创建时间
	IsDelete?: number;    // 是否删除
}