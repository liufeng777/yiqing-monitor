import React, {useEffect, useState} from 'react';
import { Modal, Button, Table, Form, Select, message, Tooltip } from 'antd';
import { inspectList, inspectAdd, inspectChange } from '../../api/index';
import { getDateTime, DateAndTime } from '../../pages/Card/DateAndTime';
import { inspectResult, measureType, termiteType, termiteAmount, warnType } from '../../assets/js/constant';

const { Option } = Select;

const getTitle = (type) => {
  let title = '';
  switch (type) {
    case 'list':
      title = '检查列表';
      break;
    case 'add':
      title = '添加检查';
      break;
    case 'edit':
      title = '修改检查';
      break;
    default:
      title = ''
  }
  return title;
}

export const WarnInspect = (props) => {
  const [tableData, setTableData] = useState([]);
  const [type, setType] = useState('list')
  const [inspect, setInspect] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    setType('list')
    setInspect({
      inspect_id: '',
      project_id: props.warn?.project_id,
      point_id: props.warn?.point_id,
      warn_id: props.warn?.warn_id,
      user_id: props.warn?.confirm_user_id,
      done_timestamp: 0,
      state: '',
      measure_type: '',
    })
    async function fetchData () {
      const res = await inspectList({
        get_count: 1000,
        start_index: 0,
        warn_id: props.warn?.warn_id
      });
      if (res) {
        setTableData(res.records)
      }
    }
    fetchData();
  }, [props.warn?.warn_id])

  return (
    <Modal
      title={getTitle(type)}
      width={type === 'list' ? 800 : 520}
      visible={props.visible}
      onCancel={() => {
        type === 'list' ? props.onCancel() : setType('list');
      }}
      footer={null}
    >
      { type === 'list' &&
        <>
        <Table pagination={false} dataSource={tableData} scroll={{y: 400}} size="small">
          <Table.Column title="工程" dataIndex="project_name" key="project_name" />
          <Table.Column title="检查完成时间" dataIndex="done_timestamp" key="done_timestamp"
            render={(val, _) => (<span>{getDateTime(val).join(' ')}</span>)}
          />
          <Table.Column title="检查结果状态" dataIndex="state" key="state"
            render={(val, _) => (<span>{inspectResult[val]}</span>)}
          />
          <Table.Column title="措施类型" dataIndex="measure_type" key="measure_type"
            render={(val, _) => (<span>{measureType[val]}</span>)}
          />
          <Table.Column title="白蚁类型" dataIndex="termite_type" key="termite_type"
            render={(val, _) => (<span>{termiteType[val]}</span>)}
          />
          <Table.Column title="蚁量" dataIndex="termite_amount" key="termite_amount"
            render={(val, _) => (<span>{termiteAmount[val]}</span>)}
          />
          <Table.Column title="操作" width="60px" dataIndex="operation" key="operation"
            render={(_, record) => (
              <>
                <Tooltip title="修改">
                  <i className="iconfont icon-xiugai" style={{color: '#1890ff'}} onClick={() => {
                    setInspect(record)
                    form.setFieldsValue({
                      ...record,
                      state: record.state + '',
                      measure_type: record.measure_type + '',
                    })
                    setType('edit')
                  }} 
                  />
                </Tooltip>
                {/* <Tooltip title="删除">
                  <i className="iconfont icon-shanchu" onClick={throttle(1000, () => this.onDelete([record.inspect_id]))} />
                </Tooltip> */}
              </>
            )}
          />
        </Table>
        <section style={{textAlign: 'center', marginTop: 10}}>
          <Button type="primary" onClick={() => {
            setType('add');
            setInspect({
              inspect_id: '',
              project_id: props.warn?.project_id,
              point_id: props.warn?.point_id,
              warn_id: props.warn?.warn_id,
              user_id: props.warn?.confirm_user_id,
              done_timestamp: 0,
              state: '',
              measure_type: '',
            })
          }}
          >添加检查</Button>
        </section>
        </>
      }
      {
        (type === 'add' || type === 'edit') && <>
          <Form initialValues={{
            ...inspect,
            state: inspect.state + '',
            measure_type: inspect.measure_type + '',
          }}
          className="detail-form inspect-form"
          onFinish={async () => {
            const res = type === 'add' ? await inspectAdd(inspect) : await inspectChange(inspect.inspect_id, inspect);
            if (res) {
              message.success(type === 'add' ? '添加成功' : '修改成功');
              const listRes = await inspectList({
                get_count: 1000,
                start_index: 0,
                warn_id: props.warn?.warn_id
              });
              if (listRes) {
                setTableData(listRes.records);
                setType('list')
              }
            }
          }}
          form={form}
          >
            <Form.Item label="工程" name="project_id">
              <span>{props.warn?.project_name}</span>
            </Form.Item>
            <Form.Item label="布点" name="point_id">
              <span>{props.warn?.point_name}</span>
            </Form.Item>
            <Form.Item label="报警" name="warn_id">
              <span>{`${props.warn?.warn_id}(${warnType[props.warn?.warn_type]})`}</span>
            </Form.Item>
            <Form.Item label="执行用户" name="user_id">
              <span>{props.warn?.confirm_user_name}</span>
            </Form.Item>
            {
              type === 'edit' && <>
                <Form.Item label="检测完成时间" name="done_timestamp">
                  <DateAndTime value={inspect.done_timestamp} onChange={(val) => {
                    setInspect({
                      ...inspect,
                      done_timestamp: val
                    })
                  }}
                  />
                </Form.Item>
                <Form.Item label="检查结果状态" name="state">
                  <Select value={inspect.state + ''} onChange={(val) => {
                    setInspect({
                      ...inspect,
                      state: +val
                    })
                  }}
                  >
                    {
                      Object.keys(inspectResult).map((key) => {
                        return <Option value={key + ''} key={key}>{inspectResult[key]}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="措施类型" name="measure_type">
                  <Select value={inspect.measure_type + ''} onChange={(val) => {
                    setInspect({
                      ...inspect,
                      measure_type: +val
                    })
                  }}
                  >
                    {
                      Object.keys(measureType).map((key) => {
                        return <Option value={key + ''} key={key}>{measureType[key]}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </>
            }
            <Form.Item>
              <section className="form-btn">
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                { type === 'edit' &&
                  <Button htmlType="button" onClick={() => {
                    setInspect({
                      project_id: props.warn?.project_id,
                      point_id: props.warn?.point_id,
                      warn_id: props.warn?.warn_id,
                      user_id: props.warn?.confirm_user_id,
                      done_timestamp: 0,
                      state: '',
                      measure_type: '',
                    })
                  }}
                  >
                    重置
                  </Button>
                }
              </section>
            </Form.Item>
          </Form>
        </>
      }
    </Modal>
  )
};
