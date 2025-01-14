# -*- coding: utf-8 -*-
"""
TencentBlueKing is pleased to support the open source community by making 蓝鲸智云-DB管理系统(BlueKing-BK-DBM) available.
Copyright (C) 2017-2023 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at https://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""
from django.utils.translation import ugettext_lazy as _

from blue_krill.data_types.enum import EnumField, StructuredEnum


class KeyDeleteType(str, StructuredEnum):
    """Key删除方式定义"""

    BY_REGEX = EnumField("regex", _("基于正则"))
    BY_FILES = EnumField("files", _("基于文件"))


class RedisVersionQueryType(str, StructuredEnum):
    """redis版本查询类型"""

    ONLINE = EnumField("online", _("查询当前版本"))
    UPDATE = EnumField("update", _("查询更新版本"))
