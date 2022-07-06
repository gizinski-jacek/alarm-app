import { useEffect, useState } from 'react';
import styles from './App.module.scss';

function App() {
	const [timerValue, setTimerValue] = useState(0);
	const [timerStarted, setTimerStarted] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const setTimerFromHour = (value: string) => {
		///
	};

	const handleChange = (value: number) => {
		setTimerValue((prevState) => prevState + value);
	};

	const clearTimer = () => {
		setTimerValue(0);
	};

	const startCountdown = () => {
		setCountdown(timerValue * 60 * 1000);
		setTimerStarted(true);
	};

	const unpauseCountdown = () => {
		setTimerStarted(true);
	};

	const pauseCountdown = () => {
		setTimerStarted(false);
	};

	const cancelCountdown = () => {
		setCountdown(0);
		setTimerStarted(false);
	};

	useEffect(() => {
		if (timerStarted) {
			const timer = setInterval(() => {
				setCountdown((prevState) => prevState - 100);
			}, 100);
			return () => {
				clearInterval(timer);
			};
		}
	}, [timerStarted]);

	return (
		<div className={styles.app}>
			<div className={styles.countdown}>
				{countdown ? new Date(countdown).toLocaleTimeString() : '00:00:00'}
			</div>
			<div className={styles.main}>
				<div className={styles.decrement_buttons}>
					<button
						type='button'
						onClick={() => handleChange(-1)}
						disabled={countdown ? true : false}
					>
						- 1
					</button>
					<button
						type='button'
						onClick={() => handleChange(-5)}
						disabled={countdown ? true : false}
					>
						- 5
					</button>
					<button
						type='button'
						onClick={() => handleChange(-10)}
						disabled={countdown ? true : false}
					>
						- 10
					</button>
					<button
						type='button'
						onClick={() => handleChange(-30)}
						disabled={countdown ? true : false}
					>
						- 30
					</button>
				</div>
				<div className={styles.controls}>
					<div className={styles.input_field}>
						<label htmlFor='timerValue'>How many minutes?</label>
						<input
							type='number'
							name='timerValue'
							id='timerValue'
							value={Math.trunc(timerValue)}
							onChange={(e) => handleChange(Number(e.target.value))}
							disabled={countdown ? true : false}
						/>
						<button
							type='button'
							onClick={clearTimer}
							disabled={countdown ? true : false}
						>
							Clear
						</button>
					</div>
					<div className={styles.countdown_controls}>
						{countdown ? (
							<button
								type='button'
								onClick={() => unpauseCountdown()}
								disabled={timerStarted ? true : false}
							>
								Unpause
							</button>
						) : (
							<button
								type='button'
								onClick={() => startCountdown()}
								disabled={countdown ? true : false}
							>
								Start
							</button>
						)}
						<button
							type='button'
							onClick={pauseCountdown}
							disabled={timerStarted ? false : true}
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
						onClick={() => handleChange(1)}
						disabled={countdown ? true : false}
					>
						+ 1
					</button>
					<button
						type='button'
						onClick={() => handleChange(5)}
						disabled={countdown ? true : false}
					>
						+ 5
					</button>
					<button
						type='button'
						onClick={() => handleChange(10)}
						disabled={countdown ? true : false}
					>
						+ 10
					</button>
					<button
						type='button'
						onClick={() => handleChange(30)}
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
