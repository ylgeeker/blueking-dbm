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

import TendbhaModel from '@services/model/mysql/tendbha';
import TendbhaInstanceModel from '@services/model/mysql/tendbha-instance';

import http from '../http';
import type { ListBase, ResourceItem, ResourceTopo } from '../types';

const getRootPath = () => `/apis/mysql/bizs/${window.PROJECT_CONFIG.BIZ_ID}/tendbha_resources`;

/**
 * 查询资源列表
 */
export function getTendbhaList(params: {
  bk_biz_id?: number;
  limit?: number;
  offset?: number;
  type?: string;
  dbType?: string;
  cluster_ids?: number[] | number;
  domain?: string;
  master_domain?: string;
  slave_domain?: string;
  exact_domain?: string;
  id?: string;
}) {
  return http.get<ListBase<TendbhaModel[]>>(`${getRootPath()}/`, params).then((data) => ({
    ...data,
    results: data.results.map(
      (item) =>
        new TendbhaModel(
          Object.assign(item, {
            permission: Object.assign({}, item.permission, data.permission),
          }),
        ),
    ),
  }));
}

export function getTendbhaSalveList(params: {
  bk_biz_id?: number;
  limit?: number;
  offset?: number;
  type?: string;
  dbType?: string;
  cluster_ids?: number[] | number;
  domain?: string;
  master_domain?: string;
  slave_domain?: string;
}) {
  return http.get<ListBase<TendbhaModel[]>>(`${getRootPath()}/`, params).then((data) => ({
    ...data,
    results: data.results.map(
      (item) =>
        new TendbhaModel(
          Object.assign(item, {
            permission: Object.assign({}, item.permission, data.permission),
            master_domain: item.slave_domain,
          }),
        ),
    ),
  }));
}

/**
 * 根据业务 ID 查询资源列表
 */
export function getTendbhaListByBizId(params: {
  bk_biz_id: number;
  limit?: number;
  offset?: number;
  cluster_ids?: number[] | number;
}) {
  return http
    .get<ListBase<TendbhaModel[]>>(`/apis/mysql/bizs/${params.bk_biz_id}/tendbha_resources/`, params)
    .then((data) => ({
      ...data,
      results: data.results.map((item: TendbhaModel) => new TendbhaModel(item)),
    }));
}

/**
 * 查询表格信息
 */
export function getTendbhaTableFields() {
  return http.get<
    {
      key: string;
      name: string;
    }[]
  >(`${getRootPath()}/get_table_fields/`);
}

/**
 * 获取集群实例列表
 */
export const getTendbhaInstanceList = function (params: Record<string, any> & { role_exclude?: string }) {
  return http.get<ListBase<TendbhaInstanceModel[]>>(`${getRootPath()}/list_instances/`, params).then((data) => ({
    ...data,
    results: data.results.map((item) => new TendbhaInstanceModel(item)),
  }));
};

/**
 * 集群实例详情
 */
interface InstanceDetails {
  bk_cloud_id: number;
  bk_cpu: number;
  bk_disk: number;
  bk_host_id: number;
  bk_host_innerip: string;
  bk_mem: number;
  bk_os_name: string;
  cluster_id: number;
  cluster_type: string;
  create_at: string;
  idc_city_id: string;
  idc_city_name: string;
  idc_id: number;
  instance_address: string;
  master_domain: string;
  net_device_id: string;
  rack: string;
  rack_id: number;
  role: string;
  slave_domain: string;
  status: string;
  sub_zone: string;
  db_module_id: number;
  cluster_type_display: string;
  bk_idc_name: string;
  bk_cloud_name: string;
  db_version: string;
  version?: string;
}

/**
 * 获取集群实例详情
 */
export function retrieveTendbhaInstance(params: {
  bk_biz_id: number;
  type: string;
  instance_address: string;
  cluster_id?: number;
  dbType: string;
}) {
  return http.get<InstanceDetails>(`${getRootPath()}/retrieve_instance/`, params);
}

/**
 * 获取集群详情
 */
export function getTendbhaDetail(params: { id: number }) {
  return http.get<ResourceItem>(`${getRootPath()}/${params.id}/`);
}

/**
 * 获取集群拓扑
 */
export function getTendbhaTopoGraph(params: { cluster_id: number }) {
  return http.get<ResourceTopo>(`${getRootPath()}/${params.cluster_id}/get_topo_graph/`);
}

/**
 * 导出集群数据为 excel 文件
 */
export function exportTendbhaClusterToExcel(params: { cluster_ids?: number[] }) {
  return http.post<string>(`${getRootPath()}/export_cluster/`, params, { responseType: 'blob' });
}

/**
 * 导出实例数据为 excel 文件
 */
export function exportTendbhaInstanceToExcel(params: { bk_host_ids?: number[] }) {
  return http.post<string>(`${getRootPath()}/export_instance/`, params, { responseType: 'blob' });
}
