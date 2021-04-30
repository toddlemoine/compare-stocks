import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import styles from './earnings_chart.module.css';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const toChartData = (data: any) => {
    return toJS(data).map((d: any) => [d.fiscalDateEnding, d.reportedEPS]);
};

export const EarningsChart: React.FC<{ data: any }> = ({ data }) => {
    useEffect(() => {
        console.log('earnings', toJS(data));
    }, [data]);

    const options = {
        chart: {
            height: '100%',
        },
        title: {
            text: 'Annual EPS',
        },
        legend: {
            enabled: false,
        },
        yAxis: {
            title: null,
        },

        series: [
            {
                type: 'line',
                data: toChartData(data),
            },
        ],
    };

    return (
        <div className={styles.root}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
