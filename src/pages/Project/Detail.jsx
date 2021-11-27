import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, InputNumber, message, Modal } from 'antd';
import { projectState } from '../../assets/js/constant';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';

const imgType = ['image/jpg', 'image/jpeg', 'image/png'];

const { Option } = Select;

const defaultDetail = {
  project_id: '',
  name: '',
  area_code: '',
  state: 1,
  comment: '',
  image_file: '',
  image_path: '',
  manu_detect_period: 14,
  inspect_period: 60
}

export const ProjectDetail = (props) => {
  const [detail, setDetail] = useState(defaultDetail);
  const [imgUrl, setImgUrl] = useState('')
  const [form] = Form.useForm();
  const initialValues = {
    ...detail,
    state: detail.state + ''
  }
  form.setFieldsValue(initialValues)

  const fileInput = useRef();

  useEffect(() => {
    setDetail(props.detail || defaultDetail)
    setImgUrl(props.detail?.image_path ? window.globalData.host + props.detail?.image_path : '');
  }, [props.detail]);

  return (
    <Modal
      width={560}
      title={props.detail ? '编辑信息' : '添加工程'}
      footer={null}
      visible={props.visible}
      onCancel={() => {
        setDetail(defaultDetail)
        setImgUrl('');
        props.onCancel();
      }}
    >
      <Form className="detail-form project-form" onFinish={(values) => {
        props.onSubmit(detail);
      }}
      form={form}
      initialValues={initialValues}
      >
        <Form.Item label="工程名" name="name"
          rules={[{ required: true, message: '请输入工程名' }]}
        >
          <Input maxLength={64} value={detail.name} onChange={(e) => {
            setDetail({
              ...detail,
              name: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="区域" name="area_code"
          rules={[{ required: true, message: '请选择区域' }]}
        >
          <SelectArea visible={props.visible} area_code={detail.area_code} onChange={({code}) => {
            setDetail({
              ...detail,
              area_code: code
            })
          }}
          />
        </Form.Item>
        <Form.Item label="状态" name="state">
          <Select value={detail.state + ''} onChange={(val) => {
            setDetail({
              ...detail,
              state: +val
            })
          }}
          >
            {
              Object.keys(projectState).map((key) => {
                return <Option value={key + ''} key={key}>{projectState[key]}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="手动探测周期(天)" name="manu_detect_period">
          <InputNumber min={0} style={{width: 134}} value={detail.manu_detect_period} onChange={(val) => {
            setDetail({
              ...detail,
              manu_detect_period: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="检查周期(天)" name="inspect_period">
          <InputNumber min={0} style={{width: 134}} value={detail.inspect_period} onChange={(val) => {
            setDetail({
              ...detail,
              inspect_period: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="图片" name="image_file">
          <div className="upload-image">
            {
              imgUrl ? <img
                alt=""
                src={imgUrl}
                style={{width: '100%', height: '100%'}}
                       /> : <span onClick={throttle(1000, () => fileInput.current.click())}>上传图片</span>
            }
            {imgUrl && <section className="img-masker">
              <i className="iconfont icon-xiugai" onClick={throttle(1000, () => fileInput.current.click())} />
              <i className="iconfont icon-shanchu" onClick={throttle(1000, () => {
                setImgUrl('');
                setDetail({
                  ...detail,
                  image_file: '',
                  image_path: ''
                })
              })}
              />
            </section>}
          </div>
        </Form.Item>
        <Form.Item label="描述" name="comment">
          <Input.TextArea maxLength={255} value={detail.comment} onChange={(e) => {
            setDetail({
              ...detail,
              comment: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item>
          <section className="form-btn">
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={throttle(1000, () => {
              if (props.detail) {
                setDetail(props.detail)
                if (props.detail.image_path) {
                  setImgUrl(window.globalData.host + props.detail.image_path)
                } else {
                  setImgUrl('')
                }
              } else {
                setDetail(defaultDetail)
                setImgUrl('')
              }
            })}
            >
              重置
            </Button>
          </section>
        </Form.Item>
      </Form>

      {/* 上传图片的input */}
      <input
        type="file"
        ref={r => fileInput.current = r}
        style={{display: 'none'}}
        id="upload-file"
        accept={imgType.toString()}
        onClick={throttle(1000, (e) => {
          e.target.value = ''
        })}
        onChange={e => {
          const file = e.target.files[0];

          if (!imgType.includes(file.type)) {
            message.warning(`请上传${imgType.join('、')}格式的图片`);
            return;
          }

          setDetail({
            ...detail,
            image_file: file
          })
          
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onload = async (r) => {
            setImgUrl(r.target.result)
          }
        }}
      />
    </Modal>
  )
}
