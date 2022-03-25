import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, InputNumber, message, Modal } from 'antd';
import { projectState } from '../../assets/js/constant';
import { SelectArea } from '../../component/SelectArea';
import { throttle } from 'throttle-debounce';
import { DateAndTime } from '../../pages/Card/DateAndTime';

const imgType = ['image/jpg', 'image/jpeg', 'image/png'];

const { Option } = Select;

const defaultDetail = {
  project_id: '',
  name: '',
  project_code: '',
  area_code: '',
  state: 1,
  comment: '',
  image_file: '',
  image_path: '',
  address: '',
  building_area: '',
  building_number: '',
  constructor: '',
  constructor_phone: '',
  builder: '',
  builder_user: '',
  builder_phone: '',
  build_timestamp: 0
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
        <Form.Item label="工程编码" name="project_code"
          rules={[{ 
            validator(rule, value) {
              const regx = /^(?![A-Z]+$)(?!\d+$)[0-9A-Z]{1,16}$/;
              if (value && !regx.test(value)) {
                return Promise.reject('由大写英文+数字组成, 最多16字符')
              }
              return Promise.resolve()
            }
          }]}
        >
          <Input maxLength={16} value={detail.project_code} onChange={(e) => {
            setDetail({
              ...detail,
              project_code: e.target.value.trim()
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
        <Form.Item label="工程地址" name="address">
          <Input maxLength={128} value={detail.address} onChange={(e) => {
            setDetail({
              ...detail,
              address: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="建筑面积" name="building_area">
          <Input maxLength={32} value={detail.building_area} onChange={(e) => {
            setDetail({
              ...detail,
              building_area: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="幢数" name="building_number">
          <InputNumber min={0} style={{width: 392}} value={detail.building_number} onChange={(val) => {
            setDetail({
              ...detail,
              building_number: val
            })
          }}
          />
        </Form.Item>
        <Form.Item label="建设单位" name="constructor">
          <Input maxLength={45} value={detail.constructor} onChange={(e) => {
            setDetail({
              ...detail,
              constructor: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="建设单位联系人" name="constructor_user">
          <Input maxLength={32} value={detail.constructor_user} onChange={(e) => {
            setDetail({
              ...detail,
              constructor_user: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="建设单位电话" name="constructor_phone">
          <Input maxLength={16} value={detail.constructor_phone} onChange={(e) => {
            setDetail({
              ...detail,
              constructor_phone: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="施工单位" name="builder">
          <Input maxLength={45} value={detail.builder} onChange={(e) => {
            setDetail({
              ...detail,
              builder: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="施工单位联系人" name="builder_user">
          <Input maxLength={32} value={detail.builder_user} onChange={(e) => {
            setDetail({
              ...detail,
              builder_user: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="施工单位电话" name="builder_phone">
          <Input maxLength={16} value={detail.builder_phone} onChange={(e) => {
            setDetail({
              ...detail,
              builder_phone: e.target.value
            })
          }}
          />
        </Form.Item>
        <Form.Item label="开工日期" name="build_timestamp">
          <DateAndTime hideTime={true} value={detail.build_timestamp} onChange={(val) => {
            setDetail({
              ...detail,
              build_timestamp: val
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
              setDetail(defaultDetail)
              setImgUrl('');
              props.onCancel();
            })}
            >
              取消
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
