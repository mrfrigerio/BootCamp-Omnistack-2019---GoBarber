import Bee from 'bee-queue'
import CancellationMail from '../app/jobs/CancellationMail'
import redisConfig from '../config/redis'

const jobs = [CancellationMail]

class Queue {
  constructor() {
    this.queues = {}
    this.init()
  }


  // Cria as filas dos jobs contidos no Array 'jobs'

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      }
    })
  }

  // Adiciona jobs às filas com os dados 'data' e salva no Redis com o método save() que retorna uma Promise
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save()
  }


  // To start processing jobs, call Queue.process and provide a handler function:
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]
      bee
        .on('failed', this.handleFailure)
        .process(handle)
    })
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err)
  }
}

export default new Queue()
