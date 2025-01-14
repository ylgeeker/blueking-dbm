/*
 * TencentBlueKing is pleased to support the open source community by making 蓝鲸智云-DB管理系统(BlueKing-BK-DBM) available.
 *
 * Copyright (C) 2017-2023 THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */
import AdminPasswordModel from '@services/model/admin-password/admin-password';
import MysqlPermissonAccountModel from '@services/model/mysql-permisson/mysql-permission-account';

import type { AccountTypesValues, ClusterTypes, DBTypes } from '@common/const';

import http, { type IRequestPayload } from '../http';
import type { ListBase } from '../types';
import type {
  AccountRule,
  AuthorizePreCheckData,
  AuthorizePreCheckResult,
  CreateAccountParams,
  PasswordPolicy,
  PasswordStrength,
  PermissionCloneRes,
  PermissionRule,
  PermissionRulesParams,
} from '../types/permission';

// 密码随机化周期
interface RamdomCycle {
  crontab: {
    minute: string;
    hour: string;
    day_of_week: string;
    day_of_month: string;
  };
}

interface AdminPasswordResultItem {
  bk_cloud_id: number;
  cluster_type: ClusterTypes;
  instances: {
    role: string;
    addresses: {
      ip: string;
      port: number;
    }[];
  }[];
}

/**
 * 查询密码安全策略
 */
export const getPasswordPolicy = (params = {}, payload = {} as IRequestPayload) =>
  http.get<PasswordPolicy>('/apis/conf/password_policy/get_password_policy/', params, payload);

/**
 * 更新密码安全策略
 */
export const updatePasswordPolicy = (params: PasswordPolicy) =>
  http.post('/apis/conf/password_policy/update_password_policy/', params);

/**
 * 查询随机化周期
 */
export const queryRandomCycle = (params = {}, payload = {} as IRequestPayload) =>
  http.get<RamdomCycle>('/apis/conf/password_policy/query_random_cycle/', params, payload);

/**
 * 更新随机化周期
 */
export const modifyRandomCycle = (params: RamdomCycle) =>
  http.post('/apis/conf/password_policy/modify_random_cycle/', params);

/**
 * 获取符合密码强度的字符串
 */
export const getRandomPassword = (params?: { security_type: 'password' | 'redis_password' }) =>
  http.get<{
    password: string;
  }>('/apis/conf/password_policy/get_random_password/', params);

/**
 * 修改实例密码(admin)
 */
export const modifyAdminPassword = (params: {
  lock_hour: number;
  password: string;
  instance_list: {
    ip: string;
    port: number;
    bk_cloud_id: number;
    cluster_type: ClusterTypes;
    role: string;
  }[];
}) =>
  http.post<{
    success: AdminPasswordResultItem[] | null;
    fail: AdminPasswordResultItem[] | null;
  }>('/apis/conf/password_policy/modify_admin_password/', params);

/**
 * 查询生效实例密码(admin)
 */
export const queryAdminPassword = (params: {
  limit?: number;
  offset?: number;
  begin_time?: string;
  end_time?: string;
  instances?: string;
  db_type: DBTypes;
}) =>
  http.post<ListBase<AdminPasswordModel[]>>('/apis/conf/password_policy/query_admin_password/', params).then((res) => ({
    ...res,
    results: res.results.map((item) => new AdminPasswordModel(item)),
  }));

/**
 * 获取公钥列表
 */
export const getRSAPublicKeys = (params: { names: string[] }) =>
  http.post<
    {
      content: string;
      description: string;
      name: string;
    }[]
  >('/apis/core/encrypt/fetch_public_keys/', params);

/**
 * 校验密码强度
 */
export const verifyPasswordStrength = (params: { password: string }) =>
  http.post<PasswordStrength>('/apis/conf/password_policy/verify_password_strength/', params);

/**
 * 查询账号规则列表
 */
export const getPermissionRules = (params: PermissionRulesParams, payload = {} as IRequestPayload) =>
  http
    .get<
      ListBase<MysqlPermissonAccountModel[]>
    >(`/apis/mysql/bizs/${params.bk_biz_id}/permission/account/list_account_rules/`, params, payload)
    .then((res) => ({
      ...res,
      results: res.results.map((item) => new MysqlPermissonAccountModel(item)),
    }));
/**
 * 创建账户
 */
export const createAccount = (params: CreateAccountParams & { bk_biz_id: number }) =>
  http.post(`/apis/mysql/bizs/${params.bk_biz_id}/permission/account/create_account/`, params);

/**
 * 删除账号
 */
export const deleteAccount = (params: { bizId: number; account_id: number; account_type?: AccountTypesValues }) =>
  http.delete(`/apis/mysql/bizs/${params.bizId}/permission/account/delete_account/`, params);

/**
 * 添加账号规则
 */
export const createAccountRule = (params: AccountRule & { bk_biz_id: number }) =>
  http.post(`/apis/mysql/bizs/${params.bk_biz_id}/permission/account/add_account_rule/`, params);

/**
 * 修改账号规则
 */
export const modifyAccountRule = (
  params: AccountRule & {
    rule_id: number;
    bk_biz_id: number;
  },
) => http.post(`/apis/mysql/bizs/${params.bk_biz_id}/permission/account/modify_account_rule/`, params);

/**
 * 授权规则前置检查
 */
export const preCheckAuthorizeRules = (params: AuthorizePreCheckData & { bizId: number }) =>
  http.post<AuthorizePreCheckResult>(`/apis/mysql/bizs/${params.bizId}/permission/authorize/pre_check_rules/`, params);

/**
 * 查询账号规则
 */
export const queryAccountRules = (params: {
  bizId: number;
  user: string;
  access_dbs: string[];
  account_type: AccountTypesValues;
}) =>
  http.post<ListBase<PermissionRule[]>>(
    `/apis/mysql/bizs/${params.bizId}/permission/account/query_account_rules/`,
    params,
  );

/**
 * 添加账号规则前置检查
 */
export const preCheckAddAccountRule = (params: {
  account_id: number | null;
  access_db: string;
  privilege: {
    dml: string[];
    ddl: string[];
    glob: string[];
  };
  account_type: AccountTypesValues;
}) =>
  http.post<{
    force_run: boolean;
    warning: string | null;
  }>(`/apis/mysql/bizs/${window.PROJECT_CONFIG.BIZ_ID}/permission/account/pre_check_add_account_rule/`, params);

/**
 * 权限克隆前置检查
 */
export const precheckPermissionClone = (params: {
  bizId: number;
  clone_type: 'instance' | 'client';
  clone_list: Array<{ source: string; target: string }>;
  clone_cluster_type: 'mysql' | 'tendbcluster';
}) => http.post<PermissionCloneRes>(`/apis/mysql/bizs/${params.bizId}/permission/clone/pre_check_clone/`, params);
