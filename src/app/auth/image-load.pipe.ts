import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Pipe({
    name: 'imgAuth'
})
export class ImageLoadPipe implements PipeTransform {

    constructor(
        private http: HttpClient
    ) {}

    async transform(src: string): Promise<string> {
        try {
            const imageBlob = await this.http.get(src, {responseType: 'blob'}).toPromise();
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL((imageBlob));
            });
        }
        catch {
            return 'assets/image-error.png';
        }
    }
}
