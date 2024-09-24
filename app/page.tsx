'use client';

import { useEffect, useRef, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import styles from './page.module.scss';

function Home() {
	const [defaultLight, setDefaultLight] = useState(false);
	const [theme, setTheme] = useLocalStorage<'dark' | 'light'>(
		'theme',
		defaultLight ? 'light' : 'dark'
	);

	const [savedAlarm, setSavedAlarm] = useLocalStorage<{
		alarmDate: number;
		alarmName: string;
	} | null>('savedAlarm', null);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
	};

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [alarmDate, setAlarmDate] = useState<Date>(new Date());
	const [selectedAlarm, setSelectedAlarm] = useState<string>('Ringtone');
	const [testAlarm, setTestAlarm] = useState<boolean>(false);
	const [startedAt, setStartedAt] = useState<number | null>(null);
	const [countdownValue, setCountdownValue] = useState<number | null>(null);
	const [playAlarm, setPlayAlarm] = useState<boolean>(false);
	const [progressValue, setProgressValue] = useState<number>(0);
	const [prevAlarmNotification, setPrevAlarmNotification] =
		useState<boolean>(false);

	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (savedAlarm) {
			if (new Date(savedAlarm.alarmDate).getTime() - 30000 <= Date.now())
				return;
			setPrevAlarmNotification(true);
		}
	}, []);

	useEffect(() => {
		if (prevAlarmNotification && savedAlarm) {
			const timer = setInterval(() => {
				if (
					savedAlarm.alarmDate &&
					new Date(savedAlarm.alarmDate).getTime() - 30000 <= Date.now()
				) {
					setSavedAlarm(null);
					setPrevAlarmNotification(false);
				}
			}, 1000);

			return () => {
				clearInterval(timer);
			};
		}
	}, [
		prevAlarmNotification,
		savedAlarm,
		setPrevAlarmNotification,
		setSavedAlarm,
	]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const defaultLight = window.matchMedia(
				'(prefers-color-scheme: light)'
			).matches;
			setDefaultLight(defaultLight);
		}
	}, []);

	const handleLoadPreviousAlarm = () => {
		if (!savedAlarm) return;
		setAlarmDate(new Date(savedAlarm.alarmDate));
		setStartedAt(Date.now());
		setSelectedAlarm(savedAlarm.alarmName);
		setSavedAlarm(null);
		setPrevAlarmNotification(false);
	};

	const handleClearPreviousAlarm = () => {
		setSavedAlarm(null);
		setPrevAlarmNotification(false);
	};

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

	const handleAlarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!audioRef || !audioRef.current) return;
		setTestAlarm(false);
		audioRef.current.pause();
		setSelectedAlarm(e.target.value);
	};

	const handleTestAlarm = () => {
		if (!audioRef || !audioRef.current) return;
		audioRef.current.currentTime = 0;
		setTestAlarm((prevState) => !prevState);
	};

	useEffect(() => {
		if (!audioRef || !audioRef.current) return;
		if (testAlarm) {
			audioRef.current.play();
		} else {
			audioRef.current.currentTime = 0;
			audioRef.current.pause();
		}
	}, [testAlarm]);

	useEffect(() => {
		const ref = audioRef;
		if (!ref || !ref.current) return;
		ref.current.addEventListener('ended', () => setTestAlarm(false));

		return () => {
			if (!ref || !ref.current) return;
			ref.current.removeEventListener('ended', () => setTestAlarm(false));
		};
	}, []);

	const handleStartCountdown = () => {
		const dateNow = Date.now();
		setCountdownValue(alarmDate.getTime() - dateNow);
		setStartedAt(dateNow);
		setSavedAlarm({
			alarmDate: alarmDate.getTime(),
			alarmName: selectedAlarm,
		});
		setPrevAlarmNotification(false);
	};

	const handleResetValues = () => {
		setAlarmDate(new Date(currentDate));
		setSavedAlarm(null);
		setPrevAlarmNotification(false);
	};

	const handleStopAlarm = () => {
		setStartedAt(null);
		setPlayAlarm(false);
		setProgressValue(0);
		setSavedAlarm(null);
		setPrevAlarmNotification(false);
	};

	useEffect(() => {
		if (startedAt) {
			const dateNow = Date.now();
			if (dateNow >= alarmDate.getTime()) {
				setPlayAlarm(true);
				setSavedAlarm(null);
				setPrevAlarmNotification(false);
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
	}, [startedAt, alarmDate, countdownValue, setSavedAlarm]);

	useEffect(() => {
		if (!audioRef || !audioRef.current) return;
		if (playAlarm) {
			audioRef.current.loop = true;
			audioRef.current.play();
		} else {
			audioRef.current.currentTime = 0;
			audioRef.current.pause();
		}
	}, [playAlarm]);

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
		sliceExtraFromEnd = 0
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
		<div className={styles.page} data-theme-mode={theme}>
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
				<div className={styles.github}>
					<a href='https://github.com/gizinski-jacek/alarm-app'>
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
				</div>
				{prevAlarmNotification && savedAlarm ? (
					<div className={styles.notification}>
						<p>
							We found your previously saved alarm for{' '}
							<span>
								{formatDateYYMMDDHHMMSS(new Date(savedAlarm.alarmDate))}.
							</span>
							Do you want to use it?
						</p>
						<div>
							<button type='button' onClick={handleLoadPreviousAlarm}>
								Yes
							</button>
							<button type='button' onClick={handleClearPreviousAlarm}>
								No
							</button>
						</div>
					</div>
				) : null}
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
								disabled={startedAt || playAlarm ? true : false}
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
								disabled={startedAt || playAlarm ? true : false}
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
									disabled={startedAt || playAlarm ? true : false}
								>
									{Array.from({ length: 24 }, (x, i) => i).map((num, i) => (
										<option key={i} value={padNumber(num)}>
											{padNumber(num)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor='selectMinute'>Minute</label>
								<select
									name='selectMinute'
									id='selectMinute'
									onChange={handleDateSelect}
									value={padNumber(alarmDate.getMinutes())}
									disabled={startedAt || playAlarm ? true : false}
								>
									{Array.from({ length: 60 }, (x, i) => i).map((num, i) => (
										<option key={i} value={padNumber(num)}>
											{padNumber(num)}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<div className={styles.alarm_select}>
						<audio ref={audioRef} src={`/sounds/${selectedAlarm}.mp3`} />
						<h4>Pick alarm sound</h4>
						<select
							name='selectAlarm'
							id='selectAlarm'
							onChange={handleAlarmChange}
							disabled={!!startedAt}
						>
							<option value='Ringtone'>Ringtone</option>
							<option value='Rooster'>Rooster</option>
							<option value='Bell'>Bell</option>
							<option value='Siren'>Siren</option>
						</select>
						<span
							className={`${styles.play_alarm} ${
								startedAt ? styles.disabled : ''
							}`}
							onClick={startedAt ? undefined : handleTestAlarm}
						>
							{testAlarm ? (
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
									<rect x='9' y='9' width='6' height='6' strokeWidth='2'></rect>
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
								playAlarm
							}
						>
							Start
						</button>
						<button
							type='button'
							onClick={handleResetValues}
							disabled={!!startedAt || playAlarm}
						>
							Reset
						</button>
						<button
							type='button'
							onClick={handleStopAlarm}
							disabled={!startedAt}
							className={playAlarm ? styles.alarmOn : ''}
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
	);
}

export default Home;
