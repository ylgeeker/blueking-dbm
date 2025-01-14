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
from rest_framework import serializers

from backend.db_meta.enums import ClusterPhase
from backend.flow.engine.controller.redis import RedisController
from backend.iam_app.dataclass.actions import ActionEnum
from backend.ticket import builders
from backend.ticket.builders.common.base import SkipToRepresentationMixin
from backend.ticket.builders.redis.base import BaseRedisTicketFlowBuilder, RedisSingleOpsBaseDetailSerializer
from backend.ticket.constants import TicketType


class RedisCloseDetailSerializer(RedisSingleOpsBaseDetailSerializer):
    pass


class RedisCloseFlowParamBuilder(builders.FlowParamBuilder):
    controller = RedisController.redis_cluster_open_close_scene

    def format_ticket_data(self):
        """
        {
            "uid": 340,
            "ticket_type": "PROXY_CLOSE",
            "created_by": "admin",
            "cluster_id": 1111,
            "force": true/false
        }
        """
        # 固定为强制，暂不给前端开放入口
        self.ticket_data.update({"force": True})
        super().format_ticket_data()


@builders.BuilderFactory.register(
    TicketType.REDIS_PROXY_CLOSE, phase=ClusterPhase.OFFLINE, iam=ActionEnum.REDIS_OPEN_CLOSE
)
class RedisCloseFlowBuilder(BaseRedisTicketFlowBuilder):
    serializer = RedisCloseDetailSerializer
    inner_flow_builder = RedisCloseFlowParamBuilder
    inner_flow_name = _("禁用集群")


class RedisInstanceCloseDetailSerializer(SkipToRepresentationMixin, serializers.Serializer):
    cluster_ids = serializers.ListField(help_text=_("集群ID列表"), child=serializers.IntegerField())
    force = serializers.BooleanField(help_text=_("是否强制"), required=False, default=True)


class RedisInstanceCloseFlowParamBuilder(builders.FlowParamBuilder):
    controller = RedisController.redis_ins_open_close_scene


@builders.BuilderFactory.register(
    TicketType.REDIS_INSTANCE_CLOSE, phase=ClusterPhase.OFFLINE, iam=ActionEnum.REDIS_OPEN_CLOSE
)
class RedisInstanceCloseFlowBuilder(BaseRedisTicketFlowBuilder):
    serializer = RedisInstanceCloseDetailSerializer
    inner_flow_builder = RedisInstanceCloseFlowParamBuilder
    inner_flow_name = _("禁用集群")
