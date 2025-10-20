import { DeviceId } from "@/core/domain";
import { DevicePhotoRepository } from "@/core/repository";

const MEDIA_PORT = Bun.env.MEDIA_PORT || 8080
const BASE_PATH = "./"
const BASE_URL = `http://localhost:${MEDIA_PORT}/photo/`

export class FileSystemPhotoRepository implements DevicePhotoRepository {
  constructor() {
    Bun.serve({
      port: MEDIA_PORT,
      routes: {
        "/photo/:filename": req => new Response(Bun.file(`${BASE_PATH}${req.params.filename}`))
      },
      error() {
        return new Response(null, { status: 404 })
      }
    });
  }

  async savePhoto(file: File, id: DeviceId): Promise<URL> {
    const extension = this.getFileExtension(file)
    if (!extension) return Promise.reject()

    const filename = `${id}.${extension}`

    await Bun.write(filename, file)

    return new URL(filename, BASE_URL)
  }

  getFileExtension(file: File): string | undefined {
    const parts = file.name.split('.');

    if (parts.length > 1) {
      return parts.pop();
    }

    return undefined;
  }
}
