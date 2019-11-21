import Bee from 'bee-queue'
import CancellationMail from '../app/jobs/CancellationMail'
import redisConfig from '../config/redis'

const jobs = [CancellationMail]

class Queue {
  constructor() {
    this.queues = {}
    this.init()
  }

  // Popula queues: Cria uma fila para cada job contido no Array 'jobs'

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle
      }
    })
  }

  // Adiciona jobs às filas e salva no Redis com o método save() que retorna uma Promise
  add(queue, job) {
    /**
     * OBS: O parâmetro passado para o método createJob é encapsulado dentro de { data: { job } }
     * e eviado ao método handle do job
     */
    return this.queues[queue].bee.createJob(job).save()
  }

  // To start processing jobs, call Queue.process and provide a handler function:
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]
      bee.on('failed', this.handleFailure).process(handle)
    })
  }

  handleFailure(job, err) {
    console.log(`The queue ${job.queue.name} failed: `, err)
  }
}

export default new Queue()
