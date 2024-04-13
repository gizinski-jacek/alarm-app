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
	const [alarmDate, setAlarmDate] = useState(new Date());
	const [selectedSound, setSelectedSound] = useState('Ringtone');
	const [testSound, setTestSound] = useState(false);
	const [startedAt, setStartedAt] = useState<number | null>(null);
	const [countdownValue, setCountdownValue] = useState<number | null>(null);
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
		newAlarmDate.setMinutes(newAlarmDate.getMinutes() - value);
		if (newAlarmDate.getTime() < currentDate.getTime()) {
			setAlarmDate(currentDate);
		} else {
			newAlarmDate.setSeconds(0);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleTimerIncrement = (value: number) => {
		const newAlarmDate = structuredClone(alarmDate);
		newAlarmDate.setMinutes(newAlarmDate.getMinutes() + value);
		const maxDate = structuredClone(currentDate);
		maxDate.setDate(maxDate.getDate() + 7);
		if (newAlarmDate.getTime() > maxDate.getTime()) {
			setAlarmDate(maxDate);
		} else {
			newAlarmDate.setSeconds(0);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleDateSelect = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { value, name } = e.target;
		const newAlarmDate = structuredClone(alarmDate);
		if (name === 'selectDate') {
			const [year, month, day] = value.split('-').map((v) => parseInt(v));
			newAlarmDate.setFullYear(year);
			newAlarmDate.setMonth(month - 1);
			newAlarmDate.setDate(day);
		} else if (name === 'selectHour') {
			const hours = parseInt(value);
			newAlarmDate.setHours(hours);
		} else if (name === 'selectMinute') {
			const minutes = parseInt(value);
			newAlarmDate.setMinutes(minutes);
		}
		const maxDate = structuredClone(currentDate);
		maxDate.setDate(maxDate.getDate() + 7);
		if (newAlarmDate.getTime() < currentDate.getTime()) {
			setAlarmDate(currentDate);
		} else if (newAlarmDate.getTime() > maxDate.getTime()) {
			setAlarmDate(maxDate);
		} else {
			newAlarmDate.setSeconds(0);
			setAlarmDate(newAlarmDate);
		}
	};

	const handleSoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSound(e.target.value);
		setAlarmSound(new Audio(`./sounds/${e.target.value}.mp3`));
		alarmSound.pause();
		setTestSound(false);
	};

	const handleTestSound = () => {
		alarmSound.currentTime = 0;
		setTestSound((prevState) => !prevState);
	};

	useEffect(() => {
		if (testSound) {
			alarmSound.play();
		} else {
			alarmSound.currentTime = 0;
			alarmSound.pause();
		}
	}, [testSound, alarmSound]);

	useEffect(() => {
		alarmSound.addEventListener('ended', () => setTestSound(false));

		return () => {
			alarmSound.removeEventListener('ended', () => setTestSound(false));
		};
	}, [alarmSound]);

	const handleStartCountdown = () => {
		const dateNow = Date.now();
		setCountdownValue(alarmDate.getTime() - dateNow);
		setStartedAt(dateNow);
		setAlarmSound(new Audio(`./sounds/${selectedSound}.mp3`));
	};

	const handleResetValues = () => {
		setAlarmDate(new Date(currentDate));
	};

	const handleStopAlarm = () => {
		setStartedAt(null);
		setPlayAlarmSound(false);
		setProgressValue(0);
	};

	useEffect(() => {
		if (startedAt) {
			const dateNow = Date.now();
			if (dateNow >= alarmDate.getTime()) {
				setPlayAlarmSound(true);
			} else {
				const timer = setInterval(() => {
					const newCountdownValue = alarmDate.getTime() - dateNow;
					setCountdownValue(newCountdownValue);
					const progress =
						(1 -
							(alarmDate.getTime() - dateNow) /
								(alarmDate.getTime() - startedAt)) *
						100;
					setProgressValue(progress);
				}, 1000);
				return () => {
					clearInterval(timer);
				};
			}
		}
	}, [startedAt, alarmDate, countdownValue]);

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

	const convertMsToCountdown = (value: number): string => {
		const ms = value % 1000;
		value = (value - ms) / 1000;
		const secs = value % 60;
		value = (value - secs) / 60;
		const mins = value % 60;
		const hrs = (value - mins) / 60;

		return padNumber(hrs) + ':' + padNumber(mins) + ':' + padNumber(secs);
	};

	const formatDateYYMMDDHHMMSS = (
		date: Date,
		sliceExtraFromEnd: number = 0
	): string => {
		const formatted = new Date(
			date.getTime() - date.getTimezoneOffset() * 60000
		)
			.toISOString()
			.replace('T', ' ')
			.slice(0, -(5 + sliceExtraFromEnd));
		return formatted;
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
										<h2>{formatDateYYMMDDHHMMSS(currentDate)}</h2>
									</div>
									<div className={styles.minutes_buttons}>
										<div className={styles.decrement_buttons}>
											{[1, 2, 3, 4, 5, 10].reverse().map((num, i) => (
												<button
													key={i}
													type='button'
													onClick={() => handleTimerDecrement(num)}
													disabled={startedAt || playAlarmSound ? true : false}
												>
													- {num}
												</button>
											))}
										</div>
										<div className={styles.increment_buttons}>
											{[1, 2, 3, 4, 5, 10].map((num, i) => (
												<button
													key={i}
													type='button'
													onClick={() => handleTimerIncrement(num)}
													disabled={startedAt || playAlarmSound ? true : false}
												>
													+ {num}
												</button>
											))}
										</div>
									</div>
									<div className={styles.main_controls}>
										<div className={styles.date_select}>
											<h4>Choose date and time for countdown</h4>
											<div>
												<div>
													<label htmlFor='selectDate'>Date</label>
													<input
														type='date'
														name='selectDate'
														id='selectDate'
														min={
															new Date(
																currentDate.getTime() -
																	currentDate.getTimezoneOffset() * 60000
															)
																.toISOString()
																.split('T')[0]
														}
														max={
															new Date(
																currentDate.getTime() +
																	7 * 24 * 60 * 60 * 1000 -
																	currentDate.getTimezoneOffset() * 60000
															)
																.toISOString()
																.split('T')[0]
														}
														step={1}
														value={
															new Date(
																alarmDate.getTime() -
																	alarmDate.getTimezoneOffset() * 60000
															)
																.toISOString()
																.split('T')[0]
														}
														onChange={handleDateSelect}
														disabled={startedAt ? true : false}
													/>
												</div>
												<div>
													<label htmlFor='selectHour'>Hour</label>
													<select
														name='selectHour'
														id='selectHour'
														onChange={handleDateSelect}
														value={padNumber(alarmDate.getHours())}
														disabled={
															startedAt || playAlarmSound ? true : false
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
												</div>
												<div>
													<label htmlFor='selectMinute'>Minute</label>
													<select
														name='selectMinute'
														id='selectMinute'
														onChange={handleDateSelect}
														value={padNumber(alarmDate.getMinutes())}
														disabled={
															startedAt || playAlarmSound ? true : false
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
											</div>
										</div>
										<div className={styles.sound_select}>
											<h4>Pick alarm sound</h4>
											<select
												name='selectSound'
												id='selectSound'
												onChange={handleSoundChange}
												disabled={!!startedAt}
											>
												<option value='Ringtone'>Ringtone</option>
												<option value='Rooster'>Rooster</option>
												<option value='Bell'>Bell</option>
												<option value='Siren'>Siren</option>
											</select>
											<span
												className={`${styles.play_sound} ${
													startedAt ? styles.disabled : ''
												}`}
												onClick={startedAt ? undefined : handleTestSound}
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
													!!startedAt ||
													alarmDate.getTime() <= currentDate.getTime() ||
													playAlarmSound
												}
											>
												Start
											</button>
											<button
												type='button'
												onClick={handleResetValues}
												disabled={!!startedAt || playAlarmSound}
											>
												Reset
											</button>
											<button
												type='button'
												onClick={handleStopAlarm}
												disabled={!startedAt}
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
												<h3>Alarm will go off at:</h3>
												<h2>{formatDateYYMMDDHHMMSS(alarmDate, 3)}</h2>
											</div>
											<div>
												<h3>Countdown:</h3>
												<h2>
													{startedAt && countdownValue
														? convertMsToCountdown(countdownValue)
														: '00:00:00'}
												</h2>
											</div>
										</div>
									</div>
								</div>
							</div>
						}
					></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
