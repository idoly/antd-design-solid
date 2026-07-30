import { createSignal } from 'solid-js';
import { render } from '@solidjs/web';
import { Button, ConfigProvider, Table, type TableRef } from '../../src';
import '../../src/styles.css';

interface Row {
  id: number;
  name: string;
  group: string;
}

declare global {
  interface Window {
    virtualTableRef?: TableRef;
  }
}

const makeRows = (start: number, count: number): Row[] => Array.from({ length: count }, (_, index) => ({
  id: start + index,
  name: `Record ${start + index}`,
  group: `Group ${(start + index) % 20}`,
}));

const started = performance.now();

function Fixture() {
  const [rows, setRows] = createSignal(makeRows(0, 10_000), { ownedWrite: true });
  return (
    <ConfigProvider>
      <main class="mx-auto max-w-4xl space-y-3 p-4">
        <h1 class="text-xl font-semibold">Virtual Table performance fixture</h1>
        <div class="flex gap-2">
          <Button onClick={() => setRows((current) => [...current, ...makeRows(current.length, 1_000)])}>Append 1000</Button>
          <Button onClick={() => setRows((current) => [...current].reverse())}>Reverse rows</Button>
          <output aria-label="Row count">{rows().length}</output>
        </div>
        <Table<Row>
          ref={(instance) => { window.virtualTableRef = instance; }}
          rowKey="id"
          virtual
          pagination={false}
          scroll={{ x: 900, y: 320 }}
          rowSelection={{ fixed: true }}
          expandable={{
            fixed: true,
            expandedRowRender: (record) => <div style={{ height: `${72 + record.id % 3 * 28}px` }}>Details for {record.name}</div>,
          }}
          columns={[
            { dataIndex: 'id', title: 'ID', width: 100, fixed: 'left' },
            { dataIndex: 'name', title: 'Name', width: 420 },
            { dataIndex: 'group', title: 'Group', width: 220, fixed: 'right' },
          ]}
          dataSource={rows()}
        />
      </main>
    </ConfigProvider>
  );
}

render(() => <Fixture />, document.getElementById('root')!);
requestAnimationFrame(() => {
  document.body.dataset.mountMs = String(performance.now() - started);
  document.body.dataset.readyMs = String(performance.now());
  document.body.dataset.ready = 'true';
});
