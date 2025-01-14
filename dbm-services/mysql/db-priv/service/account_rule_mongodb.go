package service

import (
	"dbm-services/mysql/priv-service/util"
	"fmt"
	"strings"
	"time"
)

// MongoDBAddAccountRule 新增账号规则
func (m *AccountRulePara) MongoDBAddAccountRule(jsonPara string, ticket string) error {
	var (
		accountRule TbAccountRules
		dbs         []string
		allTypePriv string
		userPriv    string
		managerPriv string
		err         error
	)
	// mongo_user: read readWrite readAnyDatabase readWriteAnyDatabase
	// mongo_manager: dbAdmin backup restore userAdmin clusterAdmin
	// 				  clusterManager clusterMonitor hostManager userAdminAnyDatabase dbAdminAnyDatabase dbOwner root
	ConstPrivType := []string{"mongo_user", "mongo_manager"}

	err = m.ParaPreCheck()
	if err != nil {
		return err
	}

	dbs, err = util.String2Slice(m.Dbname)
	if err != nil {
		return err
	}

	_, err = AccountRulePreCheck(m.BkBizId, m.AccountId, *m.ClusterType, dbs, false)
	if err != nil {
		return err
	}

	for _, _type := range ConstPrivType {
		value, exists := m.Priv[_type]
		if exists {
			if _type == "mongo_user" {
				userPriv = fmt.Sprintf("%s,%s", userPriv, value)
			} else if _type == "mongo_manager" {
				managerPriv = fmt.Sprintf("%s,%s", managerPriv, value)
			}
			allTypePriv = fmt.Sprintf("%s,%s", allTypePriv, value)
		}
	}

	userPriv = strings.Trim(userPriv, ",")
	managerPriv = strings.Trim(managerPriv, ",")
	allTypePriv = strings.Trim(allTypePriv, ",")
	vtime := time.Now()

	tx := DB.Self.Begin()
	for _, db := range dbs {
		accountRule = TbAccountRules{BkBizId: m.BkBizId, ClusterType: *m.ClusterType, AccountId: m.AccountId, Dbname: db,
			Priv:       allTypePriv,
			DmlDdlPriv: userPriv, GlobalPriv: managerPriv, Creator: m.Operator, CreateTime: vtime, UpdateTime: vtime}
		err = tx.Debug().Model(&TbAccountRules{}).Create(&accountRule).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	err = tx.Commit().Error
	if err != nil {
		return err
	}
	log := PrivLog{BkBizId: m.BkBizId, Ticket: ticket, Operator: m.Operator, Para: jsonPara, Time: vtime}
	AddPrivLog(log)

	return nil
}
