import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }
) {
  return (
    <Link
      target="_blank" 
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // [중요] 네이티브 앱 환경일 때 처리
          // 브라우저로 나가지 않고 인앱 브라우저를 띄웁니다.
          e.preventDefault();
          WebBrowser.openBrowserAsync(props.href);
        }
      }}
    /> // <-- 태그 사이의 불필요한 공백이나 생텍스트가 없는지 확인하세요.
  );
}