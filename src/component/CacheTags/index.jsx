import React from 'react';
import { Tag } from 'antd';
import { withRouter } from 'react-router';

// redux
import * as actions from '../../store/action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './index.less';

class CacheTags extends React.Component{
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <section className="tags-box">
        <Tag onClick={() => {this.props.history.push('/home')}}>首页</Tag>
        {this.props.cacheTags.map((v, index) => {
          return (
            <Tag
              key={v.path}
              closable
              color={v.path === this.props.activeTag ? 'processing' : 'default'}
              onClick={() => {
                if (v.path === this.props.activeTag) return
                this.props.history.push(v.path)
                this.props.switchTag(v.path);
              }}
              onClose={() => {
                if (v.path === this.props.activeTag) {
                  let activeIndex = index - 1;
                  if (activeIndex < 0) {
                    activeIndex = this.props.cacheTags.length > 1 ? 1 : null;
                  }
                  const activeTag = activeIndex === null ? '/home' : this.props.cacheTags[activeIndex]?.path;
                  this.props.switchTag(activeTag);
                  this.props.history.push(activeTag)
                }
                const newTags = this.props.cacheTags.filter(i => i.path !== v.path);
                this.props.setCacheTags(newTags);
              }}
            >
              {v.name}
            </Tag>
            )
        })}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cacheTags: state.cacheTags,
    activeTag: state.activeTag
  };
};

const mapDispathToProps = (dispath) => {
  return {
    ...bindActionCreators(actions, dispath),
  };
};

export default connect(mapStateToProps, mapDispathToProps)(withRouter(CacheTags));


