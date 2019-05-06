import React from 'react';
import { connect } from 'dva';
import {Button, Card, Tooltip, Alert, message} from 'antd';
import StandardTable from '@/components/standard-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import { ConnectProps } from '@/models/connect';
import { IGroupTable } from '@/models/user-group';
import GroupDrawer, { TType } from './components/group-drawer';

interface IProps extends ConnectProps {
  loading: boolean;
  groupTable: IGroupTable
}

interface IQueryData {
  page: number;
  limit: number
}

const GroupsPage: React.FC<IProps> = (props) => {
  const { groupTable, loading, dispatch } = props;

  const [visible, setVisible] = React.useState<boolean>(false);
  const [type, setType] = React.useState<TType>('create');

  const [queryData, setQueryData] = React.useState<IQueryData>({
    page: 1,
    limit: 10
  });

  React.useEffect(() => {
    getList();
  }, [queryData]);

  const getList = () => {
    dispatch({
      type: 'userGroup/fetchList',
      payload: queryData
    })
  };

  const handleSubmit = (values) => {
    dispatch({
      type: 'userGroup/fetchCreate',
      payload: values,
      callback: () => {
        setVisible(false);
        message.success('创建成功');
        getList();
      }
    });
  };

  const showCreateView = () => {
    setVisible(true);
    setType('create');
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setQueryData({
      page: current,
      limit: pageSize
    });
  };

  const columns = [
    {
      title: '用户组名称',
      dataIndex: 'name'
    },
    {
      title: '显示名称',
      dataIndex: 'displayName'
    },
    {
      title: '用户数',
      dataIndex: 'userNumber'
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
          <Tooltip placement="top" title="添加组成员">
            <Button
              size="small"
              icon="user-add"
            />
          </Tooltip>
          <Tooltip placement="top" title="赋权">
            <Button
              size="small"
              icon="api"
            />
          </Tooltip>
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
        loading={loading}
        data={groupTable}
        columns={columns}
        onChange={handleTableChange}
      />
    )
  }, [props.groupTable, props.loading]);

  return (
    <React.Fragment>
      <PageHeaderWrapper
        title="用户组管理"
        extra={[
          <Button key="1" type="primary" onClick={showCreateView}>
            新建用户组
          </Button>
        ]}
      >
        <Alert
          message="通过用户组对职责相同的用户进行分类并授权，可以更加高效地管理用户及其权限。对一个用户组进行授权后，用户组内的所有用户会自动继承该用户组的权限。如果一个用户被加入到多个用户组，那么该用户将会继承多个用户组的权限。"
          type="info"
          closable
        />
      </PageHeaderWrapper>

      <Card bordered={false}>
        {table}
      </Card>

      <GroupDrawer
        visible={visible}
        type={type}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </React.Fragment>
  )
};

GroupsPage.defaultProps = {
  loading: false
};

export default connect(({ userGroup, loading }) => ({
  groupTable: userGroup.table,
  loading: loading.effects['userGroup/fetchList'],
}))(GroupsPage);
