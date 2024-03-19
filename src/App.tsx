import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import styles from './App.module.scss';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

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
	const [startedAt, setStartedAt] = useState(0);
	const [countdownValue, setCountdownValue] = useState(0);
	const [alarmSound, setAlarmSound] = useState(
		new Audio('./sounds/Ringtone.mp3')
	);
	const [playAlarmSound, setPlayAlarmSound] = useState(false);
	const [progressValue, setProgressValue] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const handleTimerDecrement = (value: number) => {
		const newAlarmDate = structuredClone(alarmDate);
		if (timerValue === 0) {
			return;
		} else if (timerValue - value < 0) {
			setTimerValue(0);
			newAlarmDate.setMinutes(newAlarmDate.getMinutes() - timerValue);
			setAlarmDate(newAlarmDate);
		} else {
			setTimerValue((prevState) => prevState - value);
			newAlarmDate.setMinutes(alarmDate.getMinutes() - value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleTimerIncrement = (value: number) => {
		const newAlarmDate = structuredClone(alarmDate);
		if (timerValue === 1440) {
			return;
		} else if (timerValue + value > 1440) {
			setTimerValue(1440);
			newAlarmDate.setMinutes(alarmDate.getMinutes() + (1440 % timerValue));
			setAlarmDate(newAlarmDate);
		} else {
			setTimerValue((prevState) => prevState + value);
			newAlarmDate.setMinutes(newAlarmDate.getMinutes() + value);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleChangeTimerByInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		if (value < 0) {
			setTimerValue(0);
		} else if (value > 1440) {
			setTimerValue(1440);
		} else {
			setTimerValue(value);
			const newAlarmDate = structuredClone(currentDate);
			newAlarmDate.setTime(newAlarmDate.getTime() + value * 60 * 1000);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleResetValues = () => {
		setTimerValue(0);
		setAlarmDate(new Date(currentDate));
	};

	const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = parseInt(e.target.value);
		const newAlarmDate = structuredClone(alarmDate);
		newAlarmDate.setHours(value);
		if (newAlarmDate.getTime() <= currentDate.getTime()) {
			newAlarmDate.setDate(newAlarmDate.getDate() + 1);
			setAlarmDate(newAlarmDate);
			const newTimerValue =
				newAlarmDate.getHours() - currentDate.getHours() + 24;
			setTimerValue(newTimerValue * 60);
		} else if (
			newAlarmDate.getTime() >
			currentDate.getTime() + 24 * 60 * 60 * 1000
		) {
			newAlarmDate.setDate(newAlarmDate.getDate() - 1);
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getHours() - currentDate.getHours();
			setTimerValue(newTimerValue * 60);
		} else {
			setAlarmDate(newAlarmDate);
			const newTimerValue = newAlarmDate.getHours() - currentDate.getHours();
			setTimerValue(newTimerValue * 60);
		}
	};

	const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = parseInt(e.target.value);
		const newAlarmDate = structuredClone(alarmDate);
		newAlarmDate.setMinutes(value);
		if (newAlarmDate.getTime() <= currentDate.getTime()) {
			newAlarmDate.setDate(newAlarmDate.getDate() + 1);
			setAlarmDate(newAlarmDate);
			const newTimerValue =
				newAlarmDate.getMinutes() - currentDate.getMinutes() + 24 * 60;
			setTimerValue(newTimerValue);
		} else if (
			newAlarmDate.getTime() >
			currentDate.getTime() + 24 * 60 * 60 * 1000
		) {
			newAlarmDate.setDate(newAlarmDate.getDate() - 1);
			setAlarmDate(newAlarmDate);
			const newTimerValue =
				newAlarmDate.getMinutes() - currentDate.getMinutes();
			setTimerValue(newTimerValue);
		} else {
			setAlarmDate(newAlarmDate);
			const newTimerValue =
				newAlarmDate.getMinutes() - currentDate.getMinutes();
			setTimerValue(newTimerValue);
		}
	};

	const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSound(new Audio(`./sounds/${e.target.value}.mp3`));
		selectedSound.pause();
		setTestSound(false);
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
		setStartedAt(Date.now());
		const newAlarmDate = structuredClone(currentDate);
		newAlarmDate.setMinutes(currentDate.getMinutes() + timerValue);
		setAlarmDate(newAlarmDate);
		setAlarmSound(selectedSound);
		setCountdownStarted(true);
	};

	const handleStopAlarm = () => {
		setStartedAt(0);
		setCountdownStarted(false);
		setPlayAlarmSound(false);
		setProgressValue(0);
	};

	useEffect(() => {
		if (countdownStarted) {
			const dateNow = Date.now();
			if (dateNow >= startedAt + timerValue * 60 * 1000) {
				setPlayAlarmSound(true);
			} else {
				const timer = setInterval(() => {
					const newCountdownValue =
						startedAt + timerValue * 60 * 1000 - dateNow;
					setCountdownValue(newCountdownValue);
					const progress =
						((timerValue - newCountdownValue / 60 / 1000) / timerValue) * 100;
					setProgressValue(progress);
				}, 1000);
				return () => {
					clearInterval(timer);
				};
			}
		}
	}, [countdownStarted, startedAt, timerValue, countdownValue]);

	useEffect(() => {
		if (playAlarmSound) {
			alarmSound.loop = true;
			alarmSound.play();
		} else {
			alarmSound.currentTime = 0;
			alarmSound.pause();
		}
	}, [playAlarmSound, alarmSound]);

	const padNumber = (x: number): string => {
		return x.toString().padStart(2, '0');
	};

	const convertMsToTime = (value: number) => {
		const ms = value % 1000;
		value = (value - ms) / 1000;
		const secs = value % 60;
		value = (value - secs) / 60;
		const mins = value % 60;
		const hrs = (value - mins) / 60;

		return padNumber(hrs) + ':' + padNumber(mins) + ':' + padNumber(secs);
	};

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/'>
					<Route path='*' element={<Navigate to='/' />}></Route>
					<Route
						path=''
						element={
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
												currentDate.getTime() -
													currentDate.getTimezoneOffset() * 60000
											)
												.toISOString()
												.replace('T', ' ')
												.slice(0, -5)}
										</h2>
									</div>
									<div className={styles.container}>
										<div className={styles.minutes_buttons}>
											<div className={styles.decrement_buttons}>
												{[1, 2, 3, 4, 5, 10, 30].map((num, i) => (
													<button
														key={i}
														type='button'
														onClick={() => handleTimerDecrement(num)}
														disabled={
															startedAt || playAlarmSound ? true : false
														}
													>
														- {num}
													</button>
												))}
											</div>
											<div className={styles.increment_buttons}>
												{[1, 2, 3, 4, 5, 10, 30].map((num, i) => (
													<button
														key={i}
														type='button'
														onClick={() => handleTimerIncrement(num)}
														disabled={
															startedAt || playAlarmSound ? true : false
														}
													>
														+ {num}
													</button>
												))}
											</div>
										</div>
										<div className={styles.main_controls}>
											<div className={styles.minutes_input}>
												<label htmlFor='timerValue'>
													Set minutes for the countdown
												</label>
												<input
													type='number'
													name='timerValue'
													id='timerValue'
													min={0}
													max={1440}
													step={1}
													value={timerValue}
													onChange={handleChangeTimerByInput}
													disabled={startedAt ? true : false}
												/>
											</div>
											<div className={styles.time_select}>
												<h4>Or set a time for the alarm</h4>
												<select
													name='selectHour'
													id='selectHour'
													onChange={handleHourChange}
													value={padNumber(alarmDate.getHours())}
													disabled={
														countdownStarted || playAlarmSound ? true : false
													}
												>
													{Array.from({ length: 24 }, (x, i) => i).map(
														(num, i) => (
															<option key={i} value={padNumber(num)}>
																{padNumber(num)}
															</option>
														)
													)}
												</select>
												<select
													name='selectMinute'
													id='selectMinute'
													onChange={handleMinuteChange}
													value={padNumber(alarmDate.getMinutes())}
													disabled={
														countdownStarted || playAlarmSound ? true : false
													}
												>
													{Array.from({ length: 60 }, (x, i) => i).map(
														(num, i) => (
															<option key={i} value={padNumber(num)}>
																{padNumber(num)}
															</option>
														)
													)}
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
													onClick={
														countdownStarted ? undefined : handleTestSound
													}
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
													disabled={
														countdownStarted || playAlarmSound ? true : false
													}
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
						}
					></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
