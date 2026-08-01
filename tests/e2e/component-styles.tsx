import { render } from '@solidjs/web';
import { Button } from '../../src/button';
import { ConfigProvider } from '../../src/config-provider';
import { FloatButton } from '../../src/float-button';
import { Tooltip } from '../../src/tooltip';
import '../../dist/styles/base.css';
import '../../dist/styles/button.css';
import '../../dist/styles/float-button.css';
import '../../dist/styles/tooltip.css';

function ComponentStylesFixture() {
  return (
    <ConfigProvider>
      <main style={{ padding: '24px', display: 'flex', gap: '16px', 'align-items': 'center' }}>
        <Button type="primary">Split CSS button</Button>
        <Tooltip title="Split CSS tooltip" trigger="click">
          <Button>Show tooltip</Button>
        </Tooltip>
        <FloatButton aria-label="Split CSS float" icon="+" />
        <FloatButton.BackTop aria-label="Positioned back top" visibilityHeight={0} duration={0} tooltip="Positioned back top tooltip" classNames={{ root: 'positioned-back-top-root' }} styles={{ root: { position: 'fixed', right: '40px', bottom: '40px' } }} />
      </main>
    </ConfigProvider>
  );
}

render(() => <ComponentStylesFixture />, document.getElementById('root')!);
