# react-native-auto-expanding-webview
Auto-expanding WebView for React Native

## Feature
This can be nested in `ScrollView`

### Why this?
This module
- fully accepts all props of `WebView` in React Native for customizability
- is written only in JavaScript

## Requirements
This module has not yet been tested  
in every version except for:
  - `react`: `16.0.0-alpha.12`
  - `react-native`: `0.47.1`

## Installation
```sh
$ npm install react-native-auto-expanding-webview
```

## Props
- `LoadingViewComponent`: `ReactClass<any>` | `React.Element<any>`
- `onLoad`: `(contentHeight) => void`

## Example
```jsx
import { ScrollView, Text, ActivityIndicator, Dimensions } from 'react-native';
import AutoExpandingWebView from 'react-native-auto-expanding-webview';

const embedHtml = (html) => `
  <!DOCTYPE html>
  <html>
    <body>${html}</body>
  </html>
`;

const Content = ({ children }) => (
  <AutoExpandingWebView
    source={{ html: embedHtml(children) }}
    style={{ width: Dimensions.get('screen').width }}
    LoadingViewComponent={ActivityIndicator}
    didLoad={contentHeight => console.log(contentHeight)}
  />
);

const Title = ({ children }) => (
  <Text style={{ fontSize: 20, alignSelf: 'center' }}>
    { children }
  </Text>
);

const Footer = ({ children }) => (
  <Text style={{ fontSize: 20, alignSelf: 'center' }}>
    { children }
  </Text>
);

const ArticleView = ({ article }) => (
  <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
    <Title>{ article.title }</Title>
    <Content>{ article.content }</Content>
    <Footer>{ article.footer }</Footer>
  </ScrollView>
);
```
