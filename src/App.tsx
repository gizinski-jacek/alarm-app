import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import styles from './App.module.scss';

function App() {
	const defaultLight = window.matchMedia(
		'(prefers-color-scheme: light)'
	).matches;

	const [theme, setTheme] = useLocalStorage<'dark' | 'light'>(
		'theme',
		defaultLight ? 'light' : 'dark'
	);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

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
	const [progressValue, setProgressValue] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const handleTimerDecrement = (value: number) => {
		if (timerValue - value < 0) {
			setTimerValue(0);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(0);
			setAlarmDate(newAlarmDate);
		} else {
			setTimerValue((prevState) => prevState - value);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(alarmDate.getMinutes() - value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleTimerIncrement = (value: number) => {
		if (timerValue + value > 1440) {
			setTimerValue(1440);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(1440);
			setAlarmDate(newAlarmDate);
		} else {
			setTimerValue((prevState) => prevState + value);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(alarmDate.getMinutes() + value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleChangeTimerByInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		if (value < 0) {
			setTimerValue(0);
		} else if (value > 1440) {
			setTimerValue(1440);
		} else {
			setTimerValue(value);
			const newAlarmDate = alarmDate;
			newAlarmDate.setMinutes(alarmDate.getMinutes() + value);
			setAlarmDate(newAlarmDate);
		}
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
		setCountdownValue(timerValue * 60 * 1000);
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
		setProgressValue(0);
	};

	useEffect(() => {
		if (countdownStarted) {
			if (countdownValue <= 0) {
				setPlayAlarmSound(true);
			} else {
				const timer = setInterval(() => {
					setCountdownValue((prevState) => prevState - 100);
					const progress =
						((timerValue * 60 * 1000 - countdownValue) / countdownValue) * 100;
					setProgressValue(progress);
				}, 100);
				return () => {
					clearInterval(timer);
				};
			}
		}
	}, [countdownStarted, countdownValue, timerValue]);

	useEffect(() => {
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
		<div className={styles.app} data-theme-mode={theme}>
			<div className={styles.main}>
				<div
					className={`${styles.theme_toggle} ${styles[theme]}`}
					onClick={toggleTheme}
				>
					<span className={styles.theme_icon}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
							className={styles.moon}
						>
							<path
								fill='currentColor'
								d='M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z'
							/>
						</svg>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							width='24'
							height='24'
							className={styles.sun}
						>
							<path
								fill='currentColor'
								d='M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z'
							/>
						</svg>
					</span>
				</div>
				<div className={styles.current_time}>
					<h2>
						{new Date(
							currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
						)
							.toISOString()
							.replace('T', ' ')
							.slice(0, -5)}
					</h2>
				</div>
				<div className={styles.container}>
					<div className={styles.minutes_buttons}>
						<div className={styles.decrement_buttons}>
							<button
								type='button'
								onClick={() => handleTimerDecrement(1)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								- 1
							</button>
							<button
								type='button'
								onClick={() => handleTimerDecrement(5)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								- 5
							</button>
							<button
								type='button'
								onClick={() => handleTimerDecrement(10)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								- 10
							</button>
							<button
								type='button'
								onClick={() => handleTimerDecrement(30)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								- 30
							</button>
						</div>
						<div className={styles.increment_buttons}>
							<button
								type='button'
								onClick={() => handleTimerIncrement(1)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								+ 1
							</button>
							<button
								type='button'
								onClick={() => handleTimerIncrement(5)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								+ 5
							</button>
							<button
								type='button'
								onClick={() => handleTimerIncrement(10)}
								disabled={countdownValue || playAlarmSound ? true : false}
							>
								+ 10
							</button>
							<button
								type='button'
								onClick={() => handleTimerIncrement(30)}
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
								max={1440}
								step={1}
								value={timerValue}
								onChange={handleChangeTimerByInput}
								disabled={countdownValue ? true : false}
							/>
						</div>
						<div className={styles.time_select}>
							<h4>Or set a time for the alarm</h4>
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
							<h4>Pick alarm sound</h4>
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
										width='36'
										height='36'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<circle cx='12' cy='12' r='10'></circle>
										<rect
											x='9'
											y='9'
											width='6'
											height='6'
											strokeWidth='2'
										></rect>
									</svg>
								) : (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='36'
										height='36'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									>
										<circle cx='12' cy='12' r='10'></circle>
										<polygon
											points='10 8 16 12 10 16 10 8'
											strokeWidth='2'
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
									countdownStarted || !timerValue || playAlarmSound
										? true
										: false
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
						<div
							className={styles.countdown}
							style={
								{
									'--progress-bar': `${progressValue.toFixed(2)}%`,
								} as React.CSSProperties
							}
						>
							<div>
								<h3>Countdown:</h3>
								<h2>
									{countdownStarted
										? convertMsToTime(countdownValue)
										: convertMsToTime(timerValue * 60 * 1000)}
								</h2>
							</div>
							<div>
								<h3>Alarm will go off at:</h3>
								<h2>
									{countdownStarted
										? new Date(
												alarmDate.getTime() -
													alarmDate.getTimezoneOffset() * 60000
										  )
												.toISOString()
												.replace('T', ' ')
												.slice(0, -5)
										: new Date(
												currentDate.getTime() +
													timerValue * 60 * 1000 -
													currentDate.getTimezoneOffset() * 60000
										  )
												.toISOString()
												.replace('T', ' ')
												.slice(0, -5)}
								</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className={styles.footer}>
				<a href='https://github.com/gizinski-jacek/alarm-app'>
					Gizinski Jacek
					<svg
						viewBox='0 0 16 16'
						height='18px'
						width='18px'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z'
						></path>
					</svg>
				</a>
			</footer>
		</div>
	);
}

export default App;
