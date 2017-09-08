import React from 'react';
import PropTypes from 'prop-types';
import { View, WebView, ViewPropTypes } from 'react-native';

const CONTENT_HEIGHT_MESSAGE = 'CONTENT_HEIGHT_MESSAGE';

const getContentHeightScript = `
  function sendHeight() {
    if (window.postMessage.length === 1) {
      var contentHeight = document.body.clientHeight;
      window.postMessage('${CONTENT_HEIGHT_MESSAGE}' + contentHeight);
    } else {
      setTimeout(sendHeight, 100);
    }
  };
  sendHeight();
`;

export default class AutoExpandingWebView extends React.PureComponent {
  static propTypes = {
    ...WebView.propTypes,

    style: ViewPropTypes.style || View.propTypes.style,
    LoadingViewComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]),
    onLoad: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      contentHeight: null,
    };

    this.onMessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    const data = event.nativeEvent.data;

    if (data.indexOf(CONTENT_HEIGHT_MESSAGE) !== -1) {
      const contentHeight = Number(data.replace(CONTENT_HEIGHT_MESSAGE, ''));
      this.setState(
        { contentHeight },
        () => {
          this.props.onLoad && this.props.onLoad(contentHeight);
        }
      );
      return;
    }

    if (this.props.onMessage) this.props.onMessage(event);
  }

  renderLoadingView() {
    const { LoadingViewComponent } = this.props;

    if (!this.state.contentHeight && LoadingViewComponent) {
      return React.isValidElement(LoadingViewComponent)
        ? LoadingViewComponent
        : <LoadingViewComponent />;
    }
  }

  render() {
    return (
      <View>
        { this.renderLoadingView() }
        <WebView
          {...this.props}
          ref={(webview) => { this.webview = webview; }}
          style={[this.props.style, { height: this.state.contentHeight }]}
          onMessage={this.onMessage}
          injectedJavaScript={getContentHeightScript + this.props.injectedJavaScript}
          scrollEnabled={false}
          scalesPageToFit={false}
          javaScriptEnabled
        />
      </View>
    );
  }
}
