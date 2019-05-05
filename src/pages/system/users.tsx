import React from 'react';
import { connect } from 'dva';
import { Button, Card, Tooltip, Typography } from 'antd';
import StandardTable from '@/components/standard-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import { IUserTable } from '@/models/user';

interface IProps {
  userTable: IUserTable
}

const { Paragraph } = Typography;

const UsersPage: React.FC<IProps> = (props) => {
  const { userTable } = props;

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '手机号',
      dataIndex: 'mobile'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <div className="table-action">
          <Tooltip placement="top" title="更新">
            <Button
              size="small"
              icon="edit"
            />
          </Tooltip>
          <Tooltip placement="top" title="删除">
            <Button
              type="danger"
              size="small"
              icon="delete"
            />
          </Tooltip>
        </div>
      )
    }
  ];

  const table = React.useMemo(() => {
    return (
      <StandardTable
        data={userTable}
        columns={columns}
      />
    )
  }, [props.userTable]);

  return (
    <React.Fragment>
      <PageHeaderWrapper
        title="用户管理"
      >
        <Paragraph>
          用户可以单独授权，单独授权的用户将不继承已添加的用户组的权限
        </Paragraph>
      </PageHeaderWrapper>

      <Card bordered={false}>
        {table}
      </Card>

    </React.Fragment>
  )
};

UsersPage.defaultProps = {

};

export default connect(({ user }) => ({
  userTable: user.table
}))(UsersPage);
