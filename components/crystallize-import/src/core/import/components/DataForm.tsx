import { DataSheetGrid, keyColumn, textColumn } from 'react-datasheet-grid';
import type { Shape } from '@crystallize/schema/shape';

interface DataMatchingFormProps {
    shape: Shape;
    headers: string[];
    rows: Record<string, any>[];
    mapping: Record<string, string>;
    setRows: (rows: Record<string, any>[]) => void;
    setMapping: (mapping: Record<string, string>) => void;
}

export const DataMatchingForm = ({ shape, headers, rows, mapping, setMapping, setRows }: DataMatchingFormProps) => {
    const columns = headers.map((header) => ({
        ...keyColumn(header, textColumn),
        title: header,
        width: '1 1 200px',
    }));

    const shapeFields: {
        key: string;
        value: string;
        type?: string;
    }[] = [
        {
            key: 'item.name',
            value: 'Item Name',
        },
        {
            key: 'item.externalReference',
            value: 'Item External Reference',
        },
    ];

    if (shape.type === 'product') {
        shapeFields.push(
            ...[
                {
                    key: 'variant.name',
                    value: 'Variant Name',
                },
                {
                    key: 'variant.sku',
                    value: 'Variant SKU',
                },
                {
                    key: 'variant.images',
                    value: 'Variant Images',
                },
                {
                    key: 'variant.price',
                    value: 'Variant Price',
                },
                {
                    key: 'variant.stock',
                    value: 'Variant Stock',
                },
                {
                    key: 'variant.attribute',
                    value: 'Variant Attribute',
                },
                {
                    key: 'variant.externalReference',
                    value: 'Variant External Reference',
                },
            ],
        );
    }

    shape.components?.map(({ id, name, type }) =>
        shapeFields.push({
            key: `component.${id}`,
            value: `Component "${name}"`,
            type,
        }),
    );
    shape.variantComponents?.map(({ id, name, type }) =>
        shapeFields.push({
            key: `variantComponent.${id}`,
            value: `Variant Component "${name}"`,
            type,
        }),
    );

    return (
        <div className="match-form">
            <div className="match-header">
                <h1>Match column labels to item components</h1>
                <h2>
                    <strong>{rows.length}</strong> components were recognized in this file.
                </h2>
            </div>
            <div className="dsg-container" style={{ background: '#fff', overflow: 'scroll' }}>
                <div className="dsg-row" style={{ minWidth: 940 }}>
                    <div className="dsg-cell" style={{ flex: '0 0 40px' }}></div>
                    {headers.map((header) => (
                        <div key={header} className="dsg-cell" style={{ flex: '1 1 200px' }}>
                            <label className="match-label" style={{ borderBottom: 0 }}>
                                Map "{header}" to
                                <select
                                    className="match-select grey"
                                    onChange={(e) => {
                                        const m: Record<string, string> = {
                                            ...mapping,
                                        };
                                        m[e.target.value] = header;
                                        setMapping(m);
                                    }}
                                    style={{ marginTop: '10px' }}
                                >
                                    <option selected value="" />
                                    {shapeFields.map((field) => (
                                        <option key={field.key} value={field.key}>
                                            {field.value}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <DataSheetGrid value={rows} onChange={setRows} columns={columns} height={800} />
        </div>
    );
};