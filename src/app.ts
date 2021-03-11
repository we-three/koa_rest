import Koa from 'koa'
import { RouteControllerClass } from './controller'

/**
 * usage:
 *
 *      @app({
 *           controllers: []})
 *      class Application {
 *      }
 */

function app() {
  return function () {}
}

export class Application {
  protected app: Koa
  protected port: number = 3000
  protected controllers?: any[]
  static _instance: Application
  static get instance() {
    if (!this._instance) {
      this._instance = new this()
    }
    console.log(this)
    console.log(this._instance)
    return this._instance
  }
  constructor() {
    this.app = new Koa()
  }

  main(): void {
    // implement me
  }

  start() {
    const { port } = this
    this.app.listen(port, () => {
      console.log(`app is running on ${port}`)
    })
  }

  static run() {
    this.instance.main()
  }
}

export interface IConfig {
  controllers: RouteControllerClass[]
  port?: number
}

type A = typeof Application

export function Config(config: IConfig) {
  return function ConfigDecorator(constructor: A) {
    return class _Application extends constructor {
      constructor() {
        super()

        this.port = config.port ?? this.port
        // use the routes of controllers
        console.log(config)
        if (config.controllers) {
          config.controllers.forEach((controller) => {
            this.app.use(controller.getInstance().router.routes())
          })
        }
      }
    }
  }
}