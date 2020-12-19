import React, { useState, useEffect } from 'react';
import { Space, Slider, Progress } from 'antd';
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

	const sameCommitmentsPercent = (myCommitment, category) => {
		const commitmentsSum = commitments?.filter(commitment => commitment?.CommitmentTitle === myCommitment?.CommitmentTitle)
			?.length;
		const categoryCommitments = commitments?.filter(commitment => commitment?.CommitmentType === category);
		const commitmentsPercent = (commitmentsSum / categoryCommitments?.length) * 100;
		return Number(commitmentsPercent.toFixed(1));
	};

	const othersCommitments = (myCommitment, myCommitment2, category) => {
		const others = commitments?.filter(
			commitment =>
				commitment?.CommitmentTitle !== myCommitment?.CommitmentTitle &&
				commitment?.CommitmentTitle !== myCommitment2?.CommitmentTitle &&
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

				const futureCommitments = commitments?.filter(commitment => commitment?.CommitmentType === 'FutureCommitments');

				const presentCommitments = commitments?.filter(commitment => commitment?.CommitmentType === 'PresentCommitments');

				// Future commitments
				const LUC = commitments.filter(commitment => commitment.CommitmentTitle === 'Land Use Change').length;
				const LUCPercent = (LUC / futureCommitments.length) * 100;

				const CC = commitments.filter(commitment => commitment.CommitmentTitle === 'Climate Change').length;
				const CCPercent = (CC / futureCommitments.length) * 100;

				const BL = commitments.filter(commitment => commitment.CommitmentTitle === 'Biodiversity Loss').length;
				const BLPercent = (BL / futureCommitments.length) * 100;

				setFutureSeries([LUCPercent, CCPercent, BLPercent]);

				// Present commitments
				const education = commitments.filter(commitment => commitment.CommitmentTitle === 'Education').length;
				const educationPercent = (education / presentCommitments.length) * 100;

				const energy = commitments.filter(commitment => commitment.CommitmentTitle === 'Energy').length;
				const energyPercent = (energy / presentCommitments.length) * 100;

				const networks = commitments.filter(commitment => commitment.CommitmentTitle === 'Networks').length;
				const networksPercent = (networks / presentCommitments.length) * 100;

				setPresentSeries([educationPercent, energyPercent, networksPercent]);

				setLoading(false);
			} else {
				console.error('Error loading commitments', json?.error);
			}
		}
		loadChartData();
	}, []);

	const futureSliderMarks = {
		0: <span className='mark-0'>{myFutureCommitments.Commitments?.[0].CommitmentTitle}</span>,
		100: <span className='mark-100'>{myFutureCommitments.Commitments?.[1].CommitmentTitle}</span>
	};

	const presentSliderMarks = {
		0: <span className='mark-0'>{myPresentCommitments.Commitments?.[0].CommitmentTitle}</span>,
		100: <span className='mark-100'>{myPresentCommitments.Commitments?.[1].CommitmentTitle}</span>
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
									{sameCommitmentsPercent(myFutureCommitments.Commitments?.[0], 'FutureCommitments')}% also chose&nbsp;
									{myFutureCommitments.Commitments?.[0].CommitmentTitle}
								</p>
								<p className='bold'>
									{sameCommitmentsPercent(myFutureCommitments.Commitments?.[1], 'FutureCommitments')}% also chose&nbsp;
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
										myFutureCommitments.Commitments?.[0],
										myFutureCommitments.Commitments?.[1],
										'FutureCommitments'
									)}
									% also chose
									{/* {myFutureCommitments.Commitments?.[0].CommitmentTitle} */}
								</p>
							</Space>
						</div>
						<div className='slider-wrapper'>
							<h5>Average financial commitment</h5>
							<Slider
								marks={futureSliderMarks}
								defaultValue={Math.max(
									sameCommitmentsPercent(myFutureCommitments.Commitments?.[0], 'FutureCommitments'),
									sameCommitmentsPercent(myFutureCommitments.Commitments?.[1], 'FutureCommitments')
								)}
								tooltipVisible={false}
								disabled
							/>
							<div className='percentages-wrapper'>
								<span>You chose {sameCommitmentsPercent(myFutureCommitments.Commitments?.[0], 'FutureCommitments')}%</span>
								<span>You chose {sameCommitmentsPercent(myFutureCommitments.Commitments?.[1], 'FutureCommitments')}%</span>
							</div>
							<br />
							<br />
							<p>
								You commitment level is based around the ongoing financial support you will give each of your chosen
								commitments as a gift to future generations past your lifetime.
							</p>
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
									{sameCommitmentsPercent(myPresentCommitments.Commitments?.[0], 'PresentCommitments')}% also chose&nbsp;
									{myPresentCommitments.Commitments?.[0].CommitmentTitle}
								</p>
								<p className='bold'>
									{sameCommitmentsPercent(myPresentCommitments.Commitments?.[1], 'PresentCommitments')}% also chose&nbsp;
									{myPresentCommitments.Commitments?.[1].CommitmentTitle}
								</p>
							</Space>
							<div className='chart-body'>
								<PieChart height='100%' options={presentChartOptions} series={presentSeries} type='pie' />
							</div>
							<Space direction='vertical' align='start'>
								<p>Others chose</p>
								<p className='bold'>
									{othersCommitments(
										myPresentCommitments.Commitments?.[0],
										myPresentCommitments.Commitments?.[1],
										'PresentCommitments'
									)}
									% also chose
									{/* {myPresentCommitments.Commitments?.[0].CommitmentTitle} */}
								</p>
							</Space>
						</div>
						<div className='commitment-info-wrapper'>
							<Space direction='vertical' size='large'>
								<h3>{myPresentCommitments.Commitments?.[0].CommitmentTitle}</h3>
								<div>
									<p className='bold'>You commited to</p>
									<span className='medium'>buying sustainable-label products</span>
								</div>
								<div>
									<p className='small'>
										<span className='medium'>
											{sameCommitmentsPercent(myPresentCommitments.Commitments?.[0], 'PresentCommitments')}%
										</span>
										&nbsp;of participants also chose this option
									</p>
									<Progress
										strokeWidth={13}
										trailColor='#FFFFFF'
										showInfo={false}
										percent={sameCommitmentsPercent(myPresentCommitments.Commitments?.[0], 'PresentCommitments')}
									/>
								</div>
							</Space>
							<Space direction='vertical' size='large'>
								<h3>{myPresentCommitments.Commitments?.[1].CommitmentTitle}</h3>
								<div>
									<p className='bold'>You commited to</p>
									<span className='medium'>rewilding my garden/balcony/roof</span>
								</div>
								<div>
									<p className='small'>
										<span className='medium'>
											{sameCommitmentsPercent(myPresentCommitments.Commitments?.[1], 'PresentCommitments')}%
										</span>
										&nbsp;of participants also chose this option
									</p>
									<Progress
										strokeWidth={13}
										trailColor='#FFFFFF'
										showInfo={false}
										percent={sameCommitmentsPercent(myPresentCommitments.Commitments?.[1], 'PresentCommitments')}
									/>
								</div>
							</Space>
						</div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Stats;
