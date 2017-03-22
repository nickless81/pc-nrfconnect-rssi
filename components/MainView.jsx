/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* eslint react/prop-types: 0 */
/* eslint max-len: 0 */

import React from 'react';
import { defaults, Line } from 'react-chartjs-2';

const yRange = { min: -120, max: -40 };

defaults.global.tooltips.enabled = false;
defaults.global.legend.display = false;
defaults.global.animation.duration = 500;

const labels = Array.from(Array(163).keys());
const gridColors = [];
for (let i = 0; i < 82; i += 1) {
    gridColors.push('rgba(0, 0, 0, 0.05)');
    gridColors.push('rgba(0, 0, 0, 0)');
}

export default {
    mapMainViewState: (state, props) => ({
        ...props,
        rssi: state.app.data.map(v => 160 - v),
        rssiMax: state.app.dataMax.map(v => 160 - v),
        animationDuration: state.app.animationDuration,
    }),
    decorateMainView: MainView => (
        props => {
            const { rssi, rssiMax, animationDuration } = props;
            const chartData = {
                labels,
                datasets: [{
                    label: 'rssi',
                    borderColor: 'rgba(79, 140, 196, 1)',
                    backgroundColor: 'rgba(79, 140, 196, 0.3)',
                    borderWidth: 1,
                    fill: true,
                    data: rssi,
                    xAxisID: 'x-freq-1',
                    pointRadius: 0,
                    // lineTension: 1,
                }, {
                    label: 'rssiMax',
                    borderColor: 'rgba(179, 40, 96, 0.3)',
                    borderWidth: 1,
                    fill: false,
                    data: rssiMax,
                    xAxisID: 'x-freq-1',
                    pointRadius: 0,
                    // lineTension: 1,
                }],
            };

            const chartOptions = {
                animation: { duration: animationDuration },
                scales: {
                    xAxes: [{
                        id: 'x-freq-1',
                        type: 'category',
                        ticks: {
                            callback: v => ((v % 4) === 1 ? 2400 + ((v - 1) / 2) : ''),
                            minRotation: 90,
                            autoSkipPadding: 5,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'MHz',
                        },
                        gridLines: {
                            color: gridColors,
                        },
                    }],
                    yAxes: [{
                        type: 'linear',
                        min: -yRange.max,
                        max: -yRange.min,
                        ticks: {
                            callback: v => yRange.max + v + yRange.min,
                            min: -yRange.max,
                            max: -yRange.min,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'RSSI',
                        },
                    }],
                },
            };

            return (
                <MainView {...props}>
                    <Line
                        data={chartData}
                        options={chartOptions}
                    />
                </MainView>
            );
        }
    ),
};
