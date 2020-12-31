import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Space, Progress } from 'antd';
import { Loading } from '.';
import PieChart from 'react-apexcharts';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';
import { serverAPI } from '../config.json';

const commitmentsColors = {
	'Land use change': '#5C9EFF',
	'Climate change': '#4181F4',
	'Biodiversity loss': '#B5F3D8',
	'Freshwater use': '#8793AB',
};

/**
 * Component which will display a Stats.
 */
const Stats = () => {
	const [futureSeries, setFutureSeries] = useState([]);
	const [presentSeries, setPresentSeries] = useState([]);
	const [myFutureCommitments, setMyFutureCommitments] = useState([]);
	const [myPresentCommitments, setMyPresentCommitments] = useState([]);
	const [commitments, setCommitments] = useState([]);
	const [averageWalletCommitments, setAverageWalletCommitments] = useState([0, 0]);
	const [loading, setLoading] = useState(false);

	const sameCommitmentsPercent = (myCommitment, category) => {
		const possibleCommitments = commitments?.filter(commitment => commitment?.CommitmentType === category);
		const commitmentsSum = possibleCommitments?.filter(commitment => commitment?.CommitmentTitle === myCommitment);
		const commitmentsPercent = (commitmentsSum?.length * 100) / possibleCommitments?.length;
		return Number(commitmentsPercent.toFixed(1));
	};

	const othersCommitments = (category) => {
		const possibleCommitments = commitments?.filter(commitment => commitment?.CommitmentType === category);
		const myCommitmentsObject = category === 'FutureCommitments' ? myFutureCommitments : myPresentCommitments;
		const myCommitments = myCommitmentsObject?.map(commitment => commitment?.CommitmentTitle);
		const othersSet = new Set();
		const others = possibleCommitments?.filter(commitment =>
			!myCommitments.includes(commitment?.CommitmentTitle));
		others.forEach(commitment => othersSet.add(commitment?.CommitmentTitle));
		return othersSet;
	};

	useEffect(() => {
		async function loadChartData() {
			setLoading(true);

			let myFutureCommitments = await localStorage.getItem('FutureCommitments');
			let myPresentCommitments = await localStorage.getItem('PresentCommitments');

			myFutureCommitments = myFutureCommitments && (await JSON.parse(myFutureCommitments));
			setMyFutureCommitments(myFutureCommitments?.Commitments);

			myPresentCommitments = myPresentCommitments && (await JSON.parse(myPresentCommitments));
			setMyPresentCommitments(myPresentCommitments?.Commitments);

			const json = await axios.get(`${serverAPI}/commitments`);
			if (!json?.data?.error) {
				const commitments = json?.data?.data;
				setCommitments(commitments);

				const futureCommitments = commitments?.filter(commitment => commitment?.CommitmentType === 'FutureCommitments');
				const presentCommitments = commitments?.filter(commitment => commitment?.CommitmentType === 'PresentCommitments');

				// Future commitments
				const futureSeries = Object.keys(commitmentsColors).map(commitmentTitle => {
					const commitmentsPerTitle = futureCommitments.filter(commitment => commitment?.CommitmentTitle === commitmentTitle);
					return (commitmentsPerTitle?.length * 100) / futureCommitments.length;
				})
				setFutureSeries(futureSeries);

				// Present commitments
				const presentSeries = Object.keys(commitmentsColors).map(commitmentTitle => {
					const commitmentsPerTitle = presentCommitments.filter(commitment => commitment?.CommitmentTitle === commitmentTitle);
					return (commitmentsPerTitle?.length * 100) / presentCommitments.length;
				})
				setPresentSeries(presentSeries);

				const averageWalletCommitments = myFutureCommitments?.Commitments?.map(myCommitment => {
					const similarCommitments = futureCommitments.filter(commitment =>
						commitment?.CommitmentId === myCommitment?.CommitmentId	
					);
					let acc = 0;
					similarCommitments.forEach(commitment => { acc += commitment?.CommitmentWalletPercentage});
					return similarCommitments?.length ? acc / similarCommitments?.length : 0;
				});
				setAverageWalletCommitments(averageWalletCommitments);
				setLoading(false);
			} else {
				console.error('Error loading commitments', json?.data?.error);
			}
		}
		loadChartData();
	}, []);

	const futureChartOptions = {
		chart: {
			height: 300,
			type: 'pie'
		},
		colors: Object.values(commitmentsColors),
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: false
		},
		labels: Object.keys(commitmentsColors),
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
				formatter: value => value.toFixed(1) + '%'
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
		colors: Object.values(commitmentsColors),
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: false
		},
		labels: Object.keys(commitmentsColors),
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
				formatter: value => value.toFixed(1) + '%'
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
								{
									myFutureCommitments?.map(commitment => (
										<Space align='center' key={commitment?.CommitmentTitle}>
											<span
												className='legend-icon'
												style={{
													backgroundColor: commitmentsColors[commitment?.CommitmentTitle]
												}}></span>
											<p className='bold'>
												{sameCommitmentsPercent(commitment?.CommitmentTitle, 'FutureCommitments')}%
												also chose&nbsp;
												{commitment?.CommitmentTitle}
											</p>
										</Space>
									))
								}
							</Space>
							<div className='chart-body'>
								<PieChart height='100%' options={futureChartOptions} series={futureSeries} type='pie' />
							</div>
							<Space direction='vertical' align='start'>
								<p>Others chose</p>
								{
									Array.from(othersCommitments('FutureCommitments'))?.map(commitment => (
										<Space align='center' key={commitment}>
											<span
												className='legend-icon'
												style={{
													backgroundColor: commitmentsColors[commitment]
												}}></span>
											<p className='bold'>
												{sameCommitmentsPercent(commitment, 'FutureCommitments')}%
												chose&nbsp;
												{commitment}
											</p>
										</Space>
									))
								}
							</Space>
						</div>
						<div className='slider-wrapper'>
							<h5 
								className='average-commitment-header'
								style={{ 'left': `calc(${averageWalletCommitments?.[0]}% - 160px)`}}>
								Average financial commitment
							</h5>
							<br />
							<div 
								className='average-commitment' 
								style={{ 'left': `calc(${averageWalletCommitments?.[0]}% - 60px)`}}>
								<span>{averageWalletCommitments?.[0]?.toFixed(1)}% vs {averageWalletCommitments?.[1]?.toFixed(1)}%</span>
								<br />
								<br />
								<div className='pointer' />
							</div>
							<div className='slider-titles-wrapper'>
								<span>{myFutureCommitments?.[0]?.CommitmentTitle}</span>
								<span>{myFutureCommitments?.[1]?.CommitmentTitle}</span>
							</div>
							<Progress
								strokeWidth={13}
								strokeColor={commitmentsColors[myFutureCommitments?.[0]?.CommitmentTitle]}
								trailColor={commitmentsColors[myFutureCommitments?.[1]?.CommitmentTitle]}
								showInfo={false}
								percent={myFutureCommitments?.[0]?.CommitmentWalletPercentage}
							/>
							<div className='percentages-wrapper'>
								<span>You chose {myFutureCommitments?.[0]?.CommitmentWalletPercentage}%</span>
								<span>You chose {myFutureCommitments?.[1]?.CommitmentWalletPercentage}%</span>
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
								{
									myPresentCommitments?.map(commitment => (
										<Space align='center' key={commitment?.CommitmentTitle}>
											<span
												className='legend-icon'
												style={{
													backgroundColor: commitmentsColors[commitment?.CommitmentTitle]
												}}></span>
											<p className='bold'>
												{sameCommitmentsPercent(commitment?.CommitmentTitle, 'PresentCommitments')}%
												also chose&nbsp;
												{commitment?.CommitmentTitle}
											</p>
										</Space>
									))
								}
							</Space>
							<div className='chart-body'>
								<PieChart height='100%' options={presentChartOptions} series={presentSeries} type='pie' />
							</div>
							<Space direction='vertical' align='start'>
								<p>Others chose</p>
								{
									Array.from(othersCommitments('PresentCommitments'))?.map(commitment => (
										<Space align='center' key={commitment}>
											<span
												className='legend-icon'
												style={{
													backgroundColor: commitmentsColors[commitment]
												}}></span>
											<p className='bold'>
												{sameCommitmentsPercent(commitment, 'PresentCommitments')}%
												chose&nbsp;
												{commitment}
											</p>
										</Space>
									))
								}
							</Space>
						</div>
						<div className='commitment-info-wrapper'>
							<Space direction='vertical' size='large'>
								<h3>{myPresentCommitments?.[0]?.CommitmentTitle}</h3>
								<div>
									<p className='bold'>You committed to</p>
									<span className='medium'>{myPresentCommitments?.[0]?.CommitmentSupport}</span>
								</div>
								<div>
									<p className='small'>
										<span className='medium'>
											{sameCommitmentsPercent(myPresentCommitments?.[0]?.CommitmentTitle, 'PresentCommitments')}%
										</span>
										&nbsp;of participants also chose this option
									</p>
									<Progress
										strokeWidth={13}
										trailColor='#FFFFFF'
										strokeColor={commitmentsColors[myPresentCommitments?.[0]?.CommitmentTitle]}
										showInfo={false}
										percent={sameCommitmentsPercent(
											myPresentCommitments?.[0]?.CommitmentTitle,
											'PresentCommitments'
										)}
									/>
								</div>
							</Space>
							<Space direction='vertical' size='large'>
								<h3>{myPresentCommitments?.[1]?.CommitmentTitle}</h3>
								<div>
									<p className='bold'>You committed to</p>
									<span className='medium'>{myPresentCommitments?.[1]?.CommitmentSupport}</span>
								</div>
								<div>
									<p className='small'>
										<span className='medium'>
											{sameCommitmentsPercent(myPresentCommitments?.[1]?.CommitmentTitle, 'PresentCommitments')}%
										</span>
										&nbsp;of participants also chose this option
									</p>
									<Progress
										strokeWidth={13}
										strokeColor={commitmentsColors[myPresentCommitments?.[1]?.CommitmentTitle]}
										trailColor='#FFFFFF'
										showInfo={false}
										percent={sameCommitmentsPercent(
											myPresentCommitments?.[1]?.CommitmentTitle,
											'PresentCommitments'
										)}
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
