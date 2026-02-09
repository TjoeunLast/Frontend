import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  // 위에서 만든 Themed의 Text를 사용하여 테마 기능을 유지하면서 폰트만 SpaceMono로 지정
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
