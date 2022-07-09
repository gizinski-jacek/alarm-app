import { useEffect, useState } from 'react';
import styles from './App.module.scss';

function App() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [timerValue, setTimerValue] = useState(0);
	const [alarmDate, setAlarmDate] = useState(new Date());
	const [selectedSound, setSelectedSound] = useState(
		new Audio('./sounds/Ringtone.mp3')
	);
	const [testSound, setTestSound] = useState(false);
	const [countdownStarted, setCountdownStarted] = useState(false);
	const [countdownValue, setCountdownValue] = useState(0);
	const [alarmSound, setAlarmSound] = useState(
		new Audio('./sounds/Ringtone.mp3')
	);
	const [playAlarmSound, setPlayAlarmSound] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const handleChangeTimerByMinutes = (value: number) => {
		if (!(timerValue + value < 0)) {
			setTimerValue((prevState) => prevState + value);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(alarmDate.getMinutes() + value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleChangeTimerByInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		setTimerValue(value);
		const newAlarmDate = alarmDate;
		newAlarmDate.setMinutes(alarmDate.getMinutes() + value);
		setAlarmDate(newAlarmDate);
	};

	const handleResetValues = () => {
		setTimerValue(0);
		setAlarmDate(new Date(currentDate));
	};

	const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = Number(e.target.value);
		if (value <= currentDate.getHours()) {
			const newAlarmDate = structuredClone(currentDate);
			newAlarmDate.setDate(currentDate.getDate() + 1);
			newAlarmDate.setHours(value);
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getTime() - currentDate.getTime();
			setTimerValue(newTimerValue / 1000 / 60);
		} else {
			const newAlarmDate = structuredClone(currentDate);
			newAlarmDate.setHours(value);
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getTime() - currentDate.getTime();
			setTimerValue(newTimerValue / 1000 / 60);
		}
	};

	const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = Number(e.target.value);
		if (value <= currentDate.getMinutes()) {
			const newAlarmDate = structuredClone(currentDate);
			newAlarmDate.setDate(currentDate.getDate() + 1);
			newAlarmDate.setMinutes(value);
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getTime() - currentDate.getTime();
			setTimerValue(newTimerValue / 1000 / 60);
		} else {
			const newAlarmDate = structuredClone(currentDate);
			newAlarmDate.setMinutes(value);
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getTime() - currentDate.getTime();
			setTimerValue(newTimerValue / 1000 / 60);
		}
	};

	const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSound(new Audio(`./sounds/${e.target.value}.mp3`));
	};

	const handleTestSound = () => {
		selectedSound.currentTime = 0;
		setTestSound((prevState) => !prevState);
	};

	useEffect(() => {
		if (testSound) {
			selectedSound.play();
		} else {
			selectedSound.currentTime = 0;
			selectedSound.pause();
		}
	}, [testSound, selectedSound]);

	useEffect(() => {
		selectedSound.addEventListener('ended', () => setTestSound(false));

		return () => {
			selectedSound.removeEventListener('ended', () => setTestSound(false));
		};
	}, [selectedSound]);

	const handleStartCountdown = () => {
		setCountdownValue(timerValue * 60 * 25);
		// setCountdownValue(timerValue * 60 * 1000);
		const newAlarmDate = structuredClone(currentDate);
		newAlarmDate.setMinutes(currentDate.getMinutes() + timerValue);
		setAlarmDate(newAlarmDate);
		setAlarmSound(selectedSound);
		setCountdownStarted(true);
	};

	const handleStopAlarm = () => {
		setCountdownValue(0);
		setCountdownStarted(false);
		setPlayAlarmSound(false);
	};

	useEffect(() => {
		if (countdownStarted) {
			if (countdownValue <= 0) {
				setPlayAlarmSound(true);
			} else {
				const timer = setInterval(() => {
					setCountdownValue((prevState) => prevState - 100);
				}, 100);
				return () => {
					clearInterval(timer);
				};
			}
		}
	}, [countdownStarted, countdownValue]);

	useEffect(() => {
		playAlarmSound ? alarmSound.play() : alarmSound.pause();
		if (playAlarmSound) {
			alarmSound.loop = true;
			alarmSound.play();
		} else {
			alarmSound.currentTime = 0;
			alarmSound.pause();
		}
	}, [playAlarmSound, alarmSound]);

	const padString = (x: number | string) => {
		if (x.toString().length === 1) {
			return '0' + x;
		} else {
			return x;
		}
	};

	const convertMsToTime = (value: number) => {
		const ms = value % 1000;
		value = (value - ms) / 1000;
		const secs = value % 60;
		value = (value - secs) / 60;
		const mins = value % 60;
		const hrs = (value - mins) / 60;

		return padString(hrs) + ':' + padString(mins) + ':' + padString(secs);
	};

	return (
		<div className={styles.app}>
			<div className={styles.current_time}>
				<h3>Current time:</h3>
				<h3>
					{new Date(
						currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
					)
						.toISOString()
						.replace('T', ', ')
						.slice(0, -5)}
				</h3>
			</div>
			<div className={styles.container}>
				<div className={styles.minutes_buttons}>
					<div className={styles.decrement_buttons}>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(-1)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							- 1
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(-5)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							- 5
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(-10)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							- 10
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(-30)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							- 30
						</button>
					</div>
					<div className={styles.increment_buttons}>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(1)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							+ 1
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(5)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							+ 5
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(10)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							+ 10
						</button>
						<button
							type='button'
							onClick={() => handleChangeTimerByMinutes(30)}
							disabled={countdownValue || playAlarmSound ? true : false}
						>
							+ 30
						</button>
					</div>
				</div>
				<div className={styles.main_controls}>
					<div className={styles.minutes_input}>
						<label htmlFor='timerValue'>Set minutes for the countdown</label>
						<input
							type='number'
							name='timerValue'
							id='timerValue'
							min={0}
							max={999}
							value={timerValue}
							onChange={handleChangeTimerByInput}
							disabled={countdownValue ? true : false}
						/>
					</div>
					<div className={styles.time_select}>
						<p>Or set a time for the alarm</p>
						<select
							name='selectHour'
							id='selectHour'
							onChange={handleHourChange}
							value={padString(alarmDate.getHours())}
							disabled={countdownStarted || playAlarmSound ? true : false}
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
							value={padString(alarmDate.getMinutes())}
							disabled={countdownStarted || playAlarmSound ? true : false}
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
					<div className={styles.sound_select}>
						<p>Pick alarm sound</p>
						<select
							name='selectSound'
							id='selectSound'
							onChange={handleSoundChange}
							disabled={countdownStarted ? true : false}
						>
							<option value='Ringtone'>Ringtone</option>
							<option value='Rooster'>Rooster</option>
							<option value='Bell'>Bell</option>
							<option value='Siren'>Siren</option>
						</select>
						<span
							className={`${styles.play_sound} ${
								countdownStarted ? styles.disabled : ''
							}`}
							onClick={countdownStarted ? undefined : handleTestSound}
						>
							{testSound ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='32'
									height='32'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<circle cx='12' cy='12' r='10'></circle>
									<rect x='9' y='9' width='6' height='6' strokeWidth='1'></rect>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='32'
									height='32'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<circle cx='12' cy='12' r='10'></circle>
									<polygon
										points='10 8 16 12 10 16 10 8'
										strokeWidth='1'
									></polygon>
								</svg>
							)}
						</span>
					</div>
					<div className={styles.countdown_controls}>
						<button
							type='button'
							onClick={() => handleStartCountdown()}
							disabled={
								countdownStarted || !timerValue || playAlarmSound ? true : false
							}
						>
							Start
						</button>
						<button
							type='button'
							onClick={handleResetValues}
							disabled={countdownStarted || playAlarmSound ? true : false}
						>
							Reset
						</button>
						<button
							type='button'
							onClick={handleStopAlarm}
							disabled={!countdownStarted ? true : false}
							className={playAlarmSound ? styles.alarmOn : ''}
						>
							Stop
						</button>
					</div>
					<div className={styles.countdown}>
						<h3>Countdown</h3>
						<h2>{convertMsToTime(countdownValue)}</h2>
						<h3>Alarm will go off at:</h3>
						<h3>
							{countdownStarted
								? new Date(
										alarmDate.getTime() - alarmDate.getTimezoneOffset() * 60000
								  )
										.toISOString()
										.replace('T', ', ')
										.slice(0, -5)
								: new Date(
										currentDate.getTime() +
											timerValue * 60 * 1000 -
											currentDate.getTimezoneOffset() * 60000
								  )
										.toISOString()
										.replace('T', ', ')
										.slice(0, -5)}
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
