import {DateTime} from "luxon";

import {registry} from "@web/core/registry";
import {
    X2Many2DMatrixField,
    x2Many2DMatrixField,
} from "@web_widget_x2many_2d_matrix/components/x2many_2d_matrix_field/x2many_2d_matrix_field.esm";
import {X2Many2DMatrixRenderer} from "@web_widget_x2many_2d_matrix/components/x2many_2d_matrix_renderer/x2many_2d_matrix_renderer.esm";


export class TimesheetMatrixRenderer extends X2Many2DMatrixRenderer {
    static template = "hr_timesheet_sheet.TimesheetMatrixRenderer";

    _getColumns(records) {
        const columns = super._getColumns(...arguments);
        const today = DateTime.now().toISODate();
        const allRecords = records || this.list.records;

        for (const col of columns) {
            const record = allRecords.find((r) => {
                const val = r.data[this.matrixFields.x];

                if (r.fields[this.matrixFields.x].type === "many2one") {
                    return val?.id === col.value;
                }

                return val === col.value;
            });

            if (record?.data?.date) {
                const date = record.data.date;
                const dateStr =
                    date.toISODate?.() ||
                    (typeof date === "string" ? date.split(" ")[0] : null);

                col.isToday = dateStr === today;
            }
        }

        return columns;
    }

    _getCellClass(column, rowValue) {
        const x = this.columns.findIndex((c) => c.value === column.value);
        const y = this.rows.findIndex((r) => r.value === rowValue);
        const val = this.matrix[y]?.[x]?.value || 0;

        return {
            o_matrix_today: column.isToday,
            o_matrix_value_nonzero: val > 0,
            o_matrix_value_zero: val === 0,
        };
    }

    _getColumnTotalClass(column) {
        return {
            o_matrix_today: column.isToday,
        };
    }
}


export class TimesheetMatrixField extends X2Many2DMatrixField {
    static components = {
        ...X2Many2DMatrixField.components,
        X2Many2DMatrixRenderer: TimesheetMatrixRenderer,
    };
}


export const timesheetX2Many2DMatrixField = {
    ...x2Many2DMatrixField,
    component: TimesheetMatrixField,
};


registry
    .category("fields")
    .add("timesheet_x2many_2d_matrix", timesheetX2Many2DMatrixField);