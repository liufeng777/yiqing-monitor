import axios from './axios';

/**
 * 登录信息
 */
export const verifyLocal = (type, mobile, data) => axios(`sessions/verify/${type}/${mobile}`, data, 'GET')
export const login = data => axios('sessions/login', data)
export const logout = () => axios('sessions/logout', {}, 'DELETE')
export const changePassword = data => axios('sessions/changepw', data)
export const getCurrentAdmin = () => axios('sessions/admin', {}, 'GET')

/**
 * overview(首页统计信息)
 */
export const overviewStatistic = data => axios('overview/statistic', data);
export const overviewChartProjAndPoint = data => axios('overview/chart_cfg', data);
export const overviewChartWarnAndInspect = data => axios('overview/chart_supv', data);
export const overviewTopProjWarn = data => axios('overview/top_proj_warn', data);

/**
 * admin(管理员)
 */
export const adminAdd = data => axios('admin', data)
export const adminList = data => axios('admin/list', data)
export const adminGet = (id, data) => axios(`admin/${id}`, data, 'GET')
export const adminDelete = (id, data) => axios(`admin/${id}`, data, 'DELETE')
export const adminChange = (id, data) => axios(`admin/${id}`, data, 'PUT')

/**
 * user(用户)
 */
export const userAdd = data => axios('user', data)
export const userBatchDelete = (ids, data) => axios(`user/batch/[${ids}]`, data, 'DELETE')
export const userList = data => axios('user/list', data)
export const userGet = (id, data) => axios(`user/${id}`, data, 'GET')
export const userChange = (id, data) => axios(`user/${id}`, data, 'PUT')

/**
 * area(区域)
 */
export const areaAdd = data => axios('area', data);
export const areaList = data => axios('area/list', data);
export const areaChange = (code, data) => axios(`area/${code}`, data, 'PUT');
export const areaDelete = (code, data) => axios(`area/${code}`, data, 'DELETE');

/**
 * card(通讯卡)
 */
export const cardAdd = data => axios('card', data)
export const cardList = data => axios('card/list', data)
export const cardBatchDelete = (ids, data) => axios(`card/batch/[${ids}]`, data, 'DELETE')
export const cardGet = (id, data) => axios(`card/${id}`, data, 'GET')
export const cardChange = (id, data) => axios(`card/${id}`, data, 'PUT')
export const cardExport = (data) => axios('card/export', data)
export const cardImport = (data) => axios('card/import', data)

/**
 * detect(探测记录)
 */
export const detectAdd = data => axios('detect', data)
export const detectList = data => axios('detect/list', data)
export const detectBatchDelete = (ids, data) => axios(`detect/batch/[${ids}]`, data, 'DELETE')
export const detectGet = (id, data) => axios(`detect/${id}`, data, 'GET')
export const detectChange = (id, data) => axios(`detect/${id}`, data, 'PUT')
export const detectExport = (data) => axios('detect/export', data)
export const detectImport = (data) => axios('detect/import', data)

/**
 * inspect(检查)
 */
export const inspectAdd = data => axios('inspect', data, 'POST', 'multipart/form-data')
export const inspectList = data => axios('inspect/list', data)
export const inspectBatchDelete = (ids, data) => axios(`inspect/batch/[${ids}]`, data, 'DELETE')
export const inspectGet = (id, data) => axios(`inspect/${id}`, data, 'GET')
export const inspectChange = (id, data) => axios(`inspect/${id}`, data, 'PUT')
export const inspectExport = (data) => axios('inspect/export', data)
export const inspectImport = (data) => axios('inspect/import', data)


/**
 * device(设备)
 */
export const deviceAdd = data => axios('device', data)
export const deviceList = data => axios('device/list', data)
export const deviceBatchDelete = (ids, data) => axios(`device/batch/[${ids}]`, data, 'DELETE')
export const deviceGet = (id, data) => axios(`device/${id}`, data, 'GET')
export const deviceChange = (id, data) => axios(`device/${id}`, data, 'PUT')
export const deviceExport = (data) => axios('device/export', data)
export const deviceImport = (data) => axios('device/import', data)

/**
 * point(布点)
 */
export const pointAdd = data => axios('point', data)
export const pointList = data => axios('point/list', data)
export const pointBatchDelete = (ids, data) => axios(`point/batch/[${ids}]`, data, 'DELETE')
export const pointGet = (id, data) => axios(`point/${id}`, data, 'GET')
export const pointChange = (id, data) => axios(`point/${id}`, data, 'PUT')
export const pointExport = (data) => axios('point/export', data)
export const pointImport = (data) => axios('point/import', data, 'POST', 'multipart/form-data')
export const pointListSimple = (data) => axios('point/list_simp', data);
export const pointListInMap = (data) => axios('point/list_in_map', data);

/**
 * project(工程)
 */
export const projectAdd = data => axios('project', data, 'POST', 'multipart/form-data')
export const projectList = data => axios('project/list', data)
export const projectGet = (id, data) => axios(`project/${id}`, data, 'GET')
export const projectDelete = (id, data) => axios(`project/${id}`, data, 'DELETE')
export const projectChange = (id, data) => axios(`project/${id}`, data, 'PUT', 'multipart/form-data')
export const projectExport = (data) => axios('project/export', data)
export const projectImport = (data) => axios('project/import', data, 'POST', 'multipart/form-data')
export const projectMap = (data) => axios('project/list_in_map', data)
export const projectListSimple = (data) => axios('project/list_simp', data)

/**
 * project_user（工程绑定用户）
 */
export const projectUserBind = data => axios('project_user', data)
export const projectUserUnbind = (projectId, userId, data) => axios(`project_user/${projectId}/${userId}`, data, 'DELETE')
export const projectUserList = data => axios('project_user/list', data)
export const projectUserExport = (data) => axios('project_user/export', data)
export const projectUserImport = (data) => axios('project_user/import', data)
export const projectUserChange = (projectId, userId, data) => axios(`project_user/${projectId}/${userId}`, data, 'PUT')

/**
 * warn(警告)
 */
export const warningAdd = data => axios('warn', data)
export const warningList = data => axios('warn/list', data)
export const warningBatchDelete = (ids, data) => axios(`warn/batch/[${ids}]`, data, 'DELETE')
export const warningGet = (id, data) => axios(`warn/${id}`, data, 'GET')
export const warningChange = (id, data) => axios(`warn/${id}`, data, 'PUT')
export const warningExport = (data) => axios('warn/export', data)
export const warningImport = (data) => axios('warn/import', data)
export const warningListByPoint = (data) => axios('warn/list_by_point', data);
