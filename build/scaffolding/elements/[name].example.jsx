/*
  OPTIONS:
  The following options are available for Component examples:
    - No Padding variant (padding: true|false)
    - Background Image (background: path|blank)
    - Dark Background variant (brightness: 0.0-1.0)

  Example:
    ```
      examples: [{
        name: 'Default styling',
        component: (
          <Component>Lorem ipsum</Component>
        ),
        options: {
          padding: '1rem',
          background: 'path/or/url/to/image(.jpg|.gif|.png|.svg)',
          brightness: 0.5,
        }
      },
    ```
*/

import {{name}} from './{{name}}';

export default [{
  examples: [
    {
      name: 'Default styling',
      description: '',
      staticPath: '',
      component: (
        <{{name}}>Lorem ipsum</{{name}}>
      ),
      notes: ''
    }
  ]
}];
