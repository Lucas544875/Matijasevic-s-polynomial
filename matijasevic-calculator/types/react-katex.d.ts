declare module "react-katex" {
  import type { ReactNode } from "react";

  export interface MathComponentProps {
    /**
     * TeX 文字列を直接指定する場合に使用します。
     */
    math?: string;
    /**
     * `children` から TeX 文字列を渡す別の書き方。
     * ライブラリの実装上、文字列以外はサポートされません。
     */
    children?: string;
    /**
     * エラー発生時に使用する色。CSS カラー指定を受け付けます。
     */
    errorColor?: string;
    /**
     * KaTeX の解析エラーをカスタム表示したい場合のコールバック。
     */
    renderError?: (error: Error) => ReactNode;
  }

  export const BlockMath: (props: MathComponentProps) => JSX.Element;
  export const InlineMath: (props: MathComponentProps) => JSX.Element;
}
