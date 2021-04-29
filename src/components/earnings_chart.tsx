import React, { useEffect } from 'react';
import styles from './earnings_chart.module.css';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const EarningsChart: React.FC<{ data: any }> = ({ data }) => {
    useEffect(() => {
        console.log('earnings', data);
    }, [data]);

    const options = {
        title: {
            text: 'Annual Earnings',
        },
        xAxis: {
            title: 'Fiscal Date',
        },
        yAxis: {
            title: null,
        },
        series: [
            {
                type: 'line',
                data: data,
            },
        ],
    };

    return (
        <div className={styles.root}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
