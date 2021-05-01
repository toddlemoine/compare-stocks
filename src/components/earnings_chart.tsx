import React from 'react';
import { toJS } from 'mobx';
import styles from './earnings_chart.module.css';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const toChartData = (data: any) => {
    if (!data) return [];
    return toJS(data).map((d: any) => [d.fiscalDateEnding, d.reportedEPS]);
};

export const EarningsChart: React.FC<{ data: any }> = ({ data }) => {
    const options: Highcharts.Options = {
        title: undefined,
        chart: {
            height: '100%',
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            xDateFormat: '%Y',
        },
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y', this.value);
                },
            },
        },
        yAxis: {
            labels: {
                formatter: function () {
                    return '$' + this.value;
                },
            },
            title: {
                text: null,
            },
        },
        series: [
            {
                type: 'line',
                data: toChartData(data),
                name: 'EPS',
            },
        ],
    };

    return (
        <div className={styles.root}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
