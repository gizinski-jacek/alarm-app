import { useEffect, useState } from 'react';
import styles from './App.module.scss';

function App() {
	const [alarmDate, setAlarmDate] = useState(new Date());
	const [timerValue, setTimerValue] = useState(0);
	const [countdownStarted, setCountdownStarted] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const setTimerFromHour = (value: string) => {
		///
	};

	const handleTimerChange = (value: number) => {
		if (!(timerValue + value < 0)) {
			setTimerValue((prevState) => prevState + value);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(alarmDate.getMinutes() + value);
			setAlarmDate(newAlarmDate);
		}
	};

	const resetAlarmValues = () => {
		setTimerValue(0);
		setAlarmDate(new Date());
	};

	const handleHourChange = (e: any) => {
		const value = e.target.value;
		const currentDate = new Date();
		if (value <= currentDate.getHours()) {
			const newAlarmDate = currentDate;
			newAlarmDate.setDate(currentDate.getDate() + 1);
			newAlarmDate.setHours(value);
			// setSelectFieldHourValue(value);
			setAlarmDate(newAlarmDate);
		} else {
			const newAlarmDate = currentDate;
			newAlarmDate.setHours(value);
			// setSelectFieldHourValue(value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleMinuteChange = (e: any) => {
		const value = e.target.value;
		const currentDate = new Date();
		if (value <= currentDate.getMinutes()) {
			const newAlarmDate = currentDate;
			newAlarmDate.setDate(currentDate.getDate() + 1);
			newAlarmDate.setMinutes(value);
			// setSelectFieldMinuteValue(value);
			setAlarmDate(newAlarmDate);
		} else {
			const newAlarmDate = currentDate;
			newAlarmDate.setMinutes(value);
			// setSelectFieldMinuteValue(value);
			setAlarmDate(newAlarmDate);
		}
	};

	const startCountdown = () => {
		setCountdown(timerValue * 60 * 1000);
		setCountdownStarted(true);
	};

	const pauseCountdown = () => {
		setCountdownStarted(false);
	};

	const unpauseCountdown = () => {
		setCountdownStarted(true);
	};

	const cancelCountdown = () => {
		setCountdown(0);
		setCountdownStarted(false);
	};

	useEffect(() => {
		if (countdownStarted) {
			const timer = setInterval(() => {
				setCountdown((prevState) => prevState - 100);
			}, 100);
			return () => {
				clearInterval(timer);
			};
		}
	}, [countdownStarted]);

	const convertMsToTime = (s: number) => {
		const pad = (n: number) => {
			if (n.toString().length === 1) {
				return '0' + n;
			} else {
				return n;
			}
		};

		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;

		return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
	};
	return (
		<div className={styles.app}>
			<h3>Alarm will go off at:</h3>
			<h3>
				{alarmDate.toISOString().split('T')[0] +
					', ' +
					alarmDate.toISOString().split('T')[1].split('.')[0]}
			</h3>
			<div className={styles.countdown}>
				<h3>Countdown</h3>
				<h2>{convertMsToTime(countdown)}</h2>
			</div>
			<div className={styles.container}>
				<div className={styles.decrement_buttons}>
					<button
						type='button'
						onClick={() => handleTimerChange(-1)}
						disabled={countdown ? true : false}
					>
						- 1
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(-5)}
						disabled={countdown ? true : false}
					>
						- 5
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(-10)}
						disabled={countdown ? true : false}
					>
						- 10
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(-30)}
						disabled={countdown ? true : false}
					>
						- 30
					</button>
				</div>
				<div className={styles.main_controls}>
					<div className={styles.input_field}>
						<label htmlFor='timerValue'>Set minutes for the countdown</label>
						<input
							type='number'
							name='timerValue'
							id='timerValue'
							min={0}
							max={999}
							value={Math.trunc(timerValue)}
							onChange={(e) => handleTimerChange(Number(e.target.value))}
							disabled={countdown ? true : false}
						/>
					</div>
					<div className={styles.select_field}>
						<p>Or set a time for the alarm</p>
						<select
							name='selectHour'
							id='selectHour'
							onChange={handleHourChange}
							value={alarmDate.getHours().toString()}
						>
							<option value='00'>00</option>
							<option value='01'>01</option>
							<option value='02'>02</option>
							<option value='03'>03</option>
							<option value='04'>04</option>
							<option value='05'>05</option>
							<option value='06'>06</option>
							<option value='07'>07</option>
							<option value='08'>08</option>
							<option value='09'>09</option>
							<option value='10'>10</option>
							<option value='11'>11</option>
							<option value='12'>12</option>
							<option value='13'>13</option>
							<option value='14'>14</option>
							<option value='15'>15</option>
							<option value='16'>16</option>
							<option value='17'>17</option>
							<option value='18'>18</option>
							<option value='19'>19</option>
							<option value='20'>20</option>
							<option value='21'>21</option>
							<option value='22'>22</option>
							<option value='23'>23</option>
						</select>
						<select
							name='selectMinute'
							id='selectMinute'
							onChange={handleMinuteChange}
							value={alarmDate.getMinutes().toString()}
						>
							<option value='00'>00</option>
							<option value='01'>01</option>
							<option value='02'>02</option>
							<option value='03'>03</option>
							<option value='04'>04</option>
							<option value='05'>05</option>
							<option value='06'>06</option>
							<option value='07'>07</option>
							<option value='08'>08</option>
							<option value='09'>09</option>
							<option value='10'>10</option>
							<option value='11'>11</option>
							<option value='12'>12</option>
							<option value='13'>13</option>
							<option value='14'>14</option>
							<option value='15'>15</option>
							<option value='16'>16</option>
							<option value='17'>17</option>
							<option value='18'>18</option>
							<option value='19'>19</option>
							<option value='20'>20</option>
							<option value='21'>21</option>
							<option value='22'>22</option>
							<option value='23'>23</option>
							<option value='24'>24</option>
							<option value='25'>25</option>
							<option value='26'>26</option>
							<option value='27'>27</option>
							<option value='28'>28</option>
							<option value='29'>29</option>
							<option value='30'>30</option>
							<option value='31'>31</option>
							<option value='32'>32</option>
							<option value='33'>33</option>
							<option value='34'>34</option>
							<option value='35'>35</option>
							<option value='36'>36</option>
							<option value='37'>37</option>
							<option value='38'>38</option>
							<option value='39'>39</option>
							<option value='40'>40</option>
							<option value='41'>41</option>
							<option value='42'>42</option>
							<option value='43'>43</option>
							<option value='44'>44</option>
							<option value='45'>45</option>
							<option value='46'>46</option>
							<option value='47'>47</option>
							<option value='48'>48</option>
							<option value='49'>49</option>
							<option value='50'>50</option>
							<option value='51'>51</option>
							<option value='52'>52</option>
							<option value='53'>53</option>
							<option value='54'>54</option>
							<option value='55'>55</option>
							<option value='56'>56</option>
							<option value='57'>57</option>
							<option value='58'>58</option>
							<option value='59'>59</option>
						</select>
					</div>
					<div className={styles.countdown_controls}>
						{countdown ? (
							<button
								type='button'
								onClick={() => unpauseCountdown()}
								disabled={countdownStarted ? true : false}
							>
								Unpause
							</button>
						) : (
							<button
								type='button'
								onClick={() => startCountdown()}
								disabled={countdown || !timerValue ? true : false}
							>
								Start
							</button>
						)}
						<button
							type='button'
							onClick={resetAlarmValues}
							disabled={countdown ? true : false}
						>
							Reset
						</button>
						<button
							type='button'
							onClick={pauseCountdown}
							disabled={countdownStarted ? false : true}
						>
							Pause
						</button>
						<button
							type='button'
							onClick={cancelCountdown}
							disabled={countdown ? false : true}
						>
							Cancel
						</button>
					</div>
				</div>
				<div className={styles.increment_buttons}>
					<button
						type='button'
						onClick={() => handleTimerChange(1)}
						disabled={countdown ? true : false}
					>
						+ 1
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(5)}
						disabled={countdown ? true : false}
					>
						+ 5
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(10)}
						disabled={countdown ? true : false}
					>
						+ 10
					</button>
					<button
						type='button'
						onClick={() => handleTimerChange(30)}
						disabled={countdown ? true : false}
					>
						+ 30
					</button>
				</div>
			</div>
			<div className={styles.hour_selectors}>
				<button
					type='button'
					onClick={() => setTimerFromHour('00')}
					disabled={countdown ? true : false}
				>
					0
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('01')}
					disabled={countdown ? true : false}
				>
					1
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('02')}
					disabled={countdown ? true : false}
				>
					2
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('03')}
					disabled={countdown ? true : false}
				>
					3
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('04')}
					disabled={countdown ? true : false}
				>
					4
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('05')}
					disabled={countdown ? true : false}
				>
					5
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('06')}
					disabled={countdown ? true : false}
				>
					6
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('07')}
					disabled={countdown ? true : false}
				>
					7
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('08')}
					disabled={countdown ? true : false}
				>
					8
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('09')}
					disabled={countdown ? true : false}
				>
					9
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('10')}
					disabled={countdown ? true : false}
				>
					10
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('11')}
					disabled={countdown ? true : false}
				>
					11
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('12')}
					disabled={countdown ? true : false}
				>
					12
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('13')}
					disabled={countdown ? true : false}
				>
					13
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('14')}
					disabled={countdown ? true : false}
				>
					14
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('15')}
					disabled={countdown ? true : false}
				>
					15
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('16')}
					disabled={countdown ? true : false}
				>
					16
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('17')}
					disabled={countdown ? true : false}
				>
					17
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('18')}
					disabled={countdown ? true : false}
				>
					18
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('19')}
					disabled={countdown ? true : false}
				>
					19
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('20')}
					disabled={countdown ? true : false}
				>
					20
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('21')}
					disabled={countdown ? true : false}
				>
					21
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('22')}
					disabled={countdown ? true : false}
				>
					22
				</button>
				<button
					type='button'
					onClick={() => setTimerFromHour('23')}
					disabled={countdown ? true : false}
				>
					23
				</button>
			</div>
		</div>
	);
}

export default App;
