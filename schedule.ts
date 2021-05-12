import { database } from './firebase'
import Commando from 'discord.js-commando';
import dayjs from 'dayjs';
import CONSTANTS from './constants';
import EventEmmiter from 'eventemitter3'
import * as chrono from 'chrono-node'
import { TextChannel } from 'discord.js';

type Timeout = ReturnType<typeof setTimeout>
interface Schedule {
	message: string;
	schedule: Date;
	timer: Timeout | undefined;
	ref: string;
	channel: string;
}

class Scheduler extends EventEmmiter {
	static instance: Scheduler

	schedules: Schedule[] = [];
	client: Commando.CommandoClient | undefined;

	constructor() {
		super()
	}

	setClient(client: Commando.CommandoClient) {
		this.client = client
	}

	getInstance() {
		return Scheduler.instance
	}

	recalculate() {
		this.schedules.forEach((schedule) => {
			schedule.timer = setTimeout(async () => {
				if (this.client) {
					console.log('schedule.channel', schedule.channel)
					const channel = this.client.channels.cache.get(schedule.channel) as TextChannel
					// await channel.send(schedule.message)

					await database.ref(`schedules/${schedule.ref}`).remove()
				}
			}, dayjs(schedule.schedule).diff(dayjs(), 'milliseconds'))
		})
	}

	clearAll() {
		this.schedules.forEach((schedule) => {
			if (schedule.timer) {
				clearTimeout(schedule.timer)
			}
		})
	}

	async fetchSchedules() {
		database.ref('schedules').on('value', (snapshot) => {
			const schedules = snapshot.val();

			this.clearAll()

			if (!schedules) {
				this.schedules = []
				return
			}

			const scheds = Object.entries(schedules)

			this.schedules = []
			scheds.forEach(([key, sched]: [string, any]) => {
				console.log('Found schedule on ' + dayjs(sched.schedule).format('DD/MM/YYYY HH:mm:ss'))
				this.schedules.push({
					message: sched.message,
					schedule: dayjs(sched.schedule).toDate(),
					timer: undefined,
					ref: key,
					channel: sched.channel
				})
			})

			this.recalculate()
		})
	}

	async add(schedule: string, message: string, channel: string): Promise<{ date: Date, id: string}> {
		const date = chrono.parseDate(schedule)

		if (!date) {
			throw new Error('Invalid date')
		}

		if (dayjs(date).isBefore(dayjs())) {
			throw new Error('Date is in the past')
		}

		const ref = database.ref('schedules')

		var newChildRef = await ref.push();

		const setData = {
			schedule: date.getTime(),
			message,
			channel
		}
		console.log('setData', setData)
		await newChildRef.set(setData);

		return { date, id: newChildRef.key }
	}

	remove(id: string) {
		return database.ref('schedules/' + id).remove()
	}
}

const _scheduler = new Scheduler()

export const scheduler = _scheduler
