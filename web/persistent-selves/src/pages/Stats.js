import React, { useState, useEffect } from 'react';
import { Space, Slider } from 'antd';
import { Loading } from '../components';
import PieChart from 'react-apexcharts';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';

/**
 * Component which will display a Stats.
 */
const Stats = () => {
	const [futureSeries, setFutureSeries] = useState([]);
	const [presentSeries, setPresentSeries] = useState([]);
	const [myFutureCommitments, setMyFutureCommitments] = useState([]);
	const [myPresentCommitments, setMyPresentCommitments] = useState([]);
	const [commitments, setCommitments] = useState([]);
	const [loading, setLoading] = useState(false);

	const sameCommitmentsPercent = myCommitment => {
		const commitmentsSum = commitments?.filter(commitment => commitment?.CommitmentTitle === myCommitment)?.length;
		const commitmentsPercent = (commitmentsSum / commitments?.length) * 100;
		return commitmentsPercent.toFixed(1);
	};

	const othersCommitments = (myCommitment, myCommitment2, category) => {
		const others = commitments?.filter(
			commitment =>
				commitment?.CommitmentTitle !== myCommitment &&
				commitment?.CommitmentTitle !== myCommitment2 &&
				commitment?.CommitmentType === category
		);
		console.log('others', others[0]);
		// return others;
	};

	useEffect(() => {
		async function loadChartData() {
			let commitments;
			setLoading(true);

			let myFutureCommitments = await localStorage.getItem('FutureCommitments');
			let myPresentCommitments = await localStorage.getItem('PresentCommitments');

			myFutureCommitments = myFutureCommitments && (await JSON.parse(myFutureCommitments));
			setMyFutureCommitments(myFutureCommitments);

			myPresentCommitments = myPresentCommitments && (await JSON.parse(myPresentCommitments));
			setMyPresentCommitments(myPresentCommitments);
			console.log('myPresentCommitments', myPresentCommitments);

			const res = await fetch('https://selv01.iota.cafe/commitments');
			const json = await res.json();
			if (!json?.error) {
				commitments = json?.data;
				setCommitments(commitments);

				// Future commitments
				const LUC = commitments.filter(commitment => commitment.CommitmentTitle === 'Land Use Change').length;
				const LUCPercent = (LUC / commitments.length) * 100;

				const CC = commitments.filter(commitment => commitment.CommitmentTitle === 'Climate Change').length;
				const CCPercent = (CC / commitments.length) * 100;

				// const freshWater = commitments.filter(commitment => commitment.CommitmentTitle === 'Fresh Water').length;
				// const freshWaterPercent = (freshWater / commitments.length) * 100;

				const BL = commitments.filter(commitment => commitment.CommitmentTitle === 'Biodiversity Loss').length;
				const BLPercent = (BL / commitments.length) * 100;

				setFutureSeries([LUCPercent, CCPercent, BLPercent]);

				// Present commitments
				const education = commitments.filter(commitment => commitment.CommitmentTitle === 'Education').length;
				const educationPercent = (education / commitments.length) * 100;

				const energy = commitments.filter(commitment => commitment.CommitmentTitle === 'Energy').length;
				const energyPercent = (energy / commitments.length) * 100;

				const networks = commitments.filter(commitment => commitment.CommitmentTitle === 'Networks').length;
				const networksPercent = (networks / commitments.length) * 100;

				setPresentSeries([educationPercent, energyPercent, networksPercent]);

				setLoading(false);
			} else {
				console.error('Error loading commitments', json?.error);
			}
		}
		loadChartData();
	}, []);

	const marks = {
		0: <span className='mark-0'>{myFutureCommitments.Commitments?.[0].CommitmentTitle}</span>,
		100: <span className='mark-100'>{myFutureCommitments.Commitments?.[1].CommitmentTitle}</span>
	};

	const futureChartOptions = {
		chart: {
			height: 300,
			type: 'pie'
		},
		colors: ['#5C9EFF', '#4181F4', '#B5F3D8', '#8793AB'],
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: false
		},
		labels: ['Land Use Change', 'Climate Change', 'Biodiversity Loss'],
		responsive: [
			{
				breakpoint: 767,
				options: {
					chart: {
						width: 200
					}
				}
			}
		],
		tooltip: {
			y: {
				formatter: function (value) {
					return value + '%';
				}
			}
		},
		legend: {
			show: false
		}
	};

	const presentChartOptions = {
		chart: {
			height: 300,
			type: 'pie'
		},
		colors: ['#5C9EFF', '#4181F4', '#B5F3D8', '#8793AB'],
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: false
		},
		labels: ['Education', 'Energy', 'Networks'],
		responsive: [
			{
				breakpoint: 767,
				options: {
					chart: {
						width: 200
					}
				}
			}
		],
		tooltip: {
			y: {
				formatter: function (value) {
					return value + '%';
				}
			}
		},
		legend: {
			show: false
		}
	};

	return (
		<React.Fragment>
			{loading ? (
				<Loading />
			) : (
				<div className='stats-wrapper'>
					<div className='stats-header-wrapper'>
						<Space direction='vertical' size='large'>
							<h3>Results</h3>
							<span className='heading'>
								<h2>Compare your</h2>&nbsp;&nbsp;<h2 className='highlight'>choices</h2>
							</span>
							<p>
								See how others making commitments chose to make legacies for future generations and how your own choice
								compared to theirs
							</p>
						</Space>
					</div>
					<div className='chart-card-wrapper'>
						<div className='card-header-wrapper'>
							<h3>Future Commitments</h3>
							<img className='figure' src={future} alt='future logo' />
						</div>
						<div className='chart-wrapper'>
							<Space direction='vertical' align='start'>
								<p>Your choices</p>
								<p className='bold'>
									{sameCommitmentsPercent(myFutureCommitments.Commitments?.[0].CommitmentTitle)}% also chose&nbsp;
									{myFutureCommitments.Commitments?.[0].CommitmentTitle}
								</p>
								<p className='bold'>
									{sameCommitmentsPercent(myFutureCommitments.Commitments?.[1].CommitmentTitle)}% also chose&nbsp;
									{myFutureCommitments.Commitments?.[1].CommitmentTitle}
								</p>
							</Space>
							<div className='chart-body'>
								<PieChart height='100%' options={futureChartOptions} series={futureSeries} type='pie' />
							</div>
							<Space direction='vertical' align='start'>
								<p>Others chose</p>
								<p className='bold'>
									{othersCommitments(
										myFutureCommitments.Commitments?.[0].CommitmentTitle,
										myFutureCommitments.Commitments?.[1].CommitmentTitle,
										'FutureCommitments'
									)}
									% also chose
									{/* {myFutureCommitments.Commitments?.[0].CommitmentTitle} */}
								</p>
							</Space>
						</div>
						<div className='slider-wrapper'>
							<h5>Average financial commitment</h5>
							<Slider marks={marks} defaultValue={50} tooltipVisible={false} disabled />
							<div className='percentages-wrapper'>
								{/* <span>{myFutureCommitments.Commitments?.[0]}</span>
								<span>{myFutureCommitments.Commitments?.[1]}</span> */}
							</div>
						</div>
					</div>

					<div className='chart-card-wrapper'>
						<div className='card-header-wrapper'>
							<h3>Present Commitments</h3>
							<img className='figure' src={present} alt='present logo' />
						</div>
						<div className='chart-wrapper'>
							<Space direction='vertical' align='start'>
								<p>Your choices</p>
								<p className='bold'>
									{sameCommitmentsPercent(myPresentCommitments.Commitments?.[0].CommitmentTitle)}% also chose&nbsp;
									{myPresentCommitments.Commitments?.[0].CommitmentTitle}
								</p>
								<p className='bold'>
									{sameCommitmentsPercent(myPresentCommitments.Commitments?.[1].CommitmentTitle)}% also chose&nbsp;
									{myPresentCommitments.Commitments?.[1].CommitmentTitle}
									{console.log('myPresentCommitments', myPresentCommitments)}
								</p>
							</Space>
							<div className='chart-body'>
								<PieChart height='100%' options={presentChartOptions} series={presentSeries} type='pie' />
							</div>
							<Space direction='vertical' align='start'>
								<p>Others chose</p>
								<p className='bold'>
									{
										othersCommitments(
											myPresentCommitments.Commitments?.[0].CommitmentTitle,
											myPresentCommitments.Commitments?.[1].CommitmentTitle,
											'PresentCommitments'
										)?.[0].CommitmentTitle
									}
									% also chose
									{/* {myPresentCommitments.Commitments?.[0].CommitmentTitle} */}
								</p>
							</Space>
						</div>
						<div className='slider-wrapper'>
							<h5>Average financial commitment</h5>
							<Slider marks={marks} defaultValue={50} tooltipVisible={false} disabled />
							<div className='percentages-wrapper'>
								{/* <span>{myPresentCommitments.Commitments?.[0]}</span>
								<span>{myPresentCommitments.Commitments?.[1]}</span> */}
							</div>
						</div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Stats;
