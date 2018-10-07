declare module '@thibmaek/rn-bounce' {

  import { ComponentClass, ReactNode } from 'react';

  interface Props {
    /* Component tree which gets animated with the Bounce component */
    children?: ReactNode,

    /* Direction to bounce in from, default left */
    bounceInFrom?: 'bottom' | 'left' | 'right' | 'top',

    /* Should the rendered view appear at top z level */
    topLevel?: boolean,
  }

  const Bounce: ComponentClass<Props>
  export default Bounce;

}
