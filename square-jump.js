window.onload = function() {
    var cube = {};
    var cw = 500; //Ширина контейнера
    var ch = 300; //Высота контейнера
    var fps = 100; //частота обновления
    var n_cube = 0; //кол-во кубов на поле изначально
    var max_step = 2; //разброс по сторонам при отскоке

    function create_cube(n = 1, w = 50, h = 50) {
        for (let i = 0;i<n;i++) {
            n_cube++;
            var cube_container = document.createElement('div');
            cube_container.setAttribute( "id", "container_cub" + n_cube );
            cube_container.className = 'container_cub';
            cube_container.style.width = w + 'px';
            cube_container.style.height = h + 'px';
            cube_container.style.backgroundColor = getRandomColor();

            document.getElementById('container').appendChild(cube_container);
            cube[n_cube] =
                {w: w,
                    h:h,
                    w_cor: randomizer(0, cw - w),
                    h_cor: randomizer(0, ch - h),
                    step_h: 1,
                    step_w: 1,
                    obj: cube_container
                };
        }
    }

    function start() {
        //Решил всё сделать так, что можно сделать их даже не два, а скажем, 10 и всё будет работать
        create_cube(1, 60, 35); //Создаём прямоугольник
        create_cube(1, 90, 60); //Создаём прямоугольник
        animate();
    }

    function randomizer(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function generate(n) {
        var ret = Math.round((Math.random() * (max_step - 0.1) + 1)*100) / 100;
        return n > 0 ? -ret : ret;
    }

    function animate() {
        var timer = setTimeout(function frame() {
            let cur_cube;
            for (let i in cube) { //перебираем весь массив с кубами
                cur_cube = cube[i];
                for (let j in cube) {
                    if (i === j) {
                        continue;
                    }
                    //Сейчас будет страшное условие, лучше закрыть глаза, ахахах
                    if ((cur_cube['h_cor'] < cube[j]['h_cor'] + cube[j]['h'] &&
                        cur_cube['h_cor'] + cur_cube['h'] > cube[j]['h_cor'] &&
                        cur_cube['w_cor'] + cur_cube['w'] < cube[j]['w_cor'] &&
                        cur_cube['w_cor'] > cube[j]['w_cor'] + cube[j]['w'])
                        ||
                        (cube[j]['h_cor'] < cur_cube['h_cor'] + cur_cube['h'] &&
                            cube[j]['h_cor'] + cube[j]['h'] > cur_cube['h_cor'] &&
                            cube[j]['w_cor'] + cube[j]['w'] > cur_cube['w_cor'] &&
                            cube[j]['w_cor'] < cur_cube['w_cor'] + cur_cube['w'])) {

                        cur_cube['step_h'] = generate(cur_cube['step_h']);
                        cur_cube['step_w'] = generate(cur_cube['step_w']);
                        cube[j]['step_h'] = generate(cube[j]['step_h']);
                        cube[j]['step_w'] = generate(cube[j]['step_w']);
                        cur_cube['h_cor'] += cur_cube['step_h'] < 0 ? -max_step : max_step; //это нужно, чтобы исключить залипания друг в друге
                        cur_cube['w_cor'] += cur_cube['step_w'] < 0 ? -max_step : max_step; //это нужно, чтобы исключить залипания друг в друге
                    }
                }

                if (cur_cube['h_cor'] >= ch - cur_cube['h'] || cur_cube['h_cor'] <= 1) { //Если достал до стенки по вертикали
                    cur_cube['h_cor'] += cur_cube['step_h'] > 0 ? -max_step : max_step; //это нужно, чтобы исключить залипания в стене
                    cur_cube['step_h'] = generate(cur_cube['step_h']); // при столкновении со стеной, шаг инвертируется и рандомно меняется. Это нужно чтобы объекты не летали по одной траектории
                }
                if (cur_cube['w_cor'] >= cw - cur_cube['w'] || cur_cube['w_cor'] <= 1) { //Если достал до стенки по горизонтали
                    cur_cube['w_cor'] += cur_cube['step_w'] > 0 ? -max_step : max_step;
                    cur_cube['step_w'] = generate(cur_cube['step_w']);
                }

                cur_cube['h_cor'] = Math.round(cur_cube['h_cor'] + cur_cube['step_h']); //осуществляем движение
                cur_cube['w_cor'] = Math.round(cur_cube['w_cor'] + cur_cube['step_w']); //осуществляем движение
                cur_cube['obj'].style.top = cur_cube['h_cor'] + 'px'; //перемещаем див
                cur_cube['obj'].style.left = cur_cube['w_cor'] + 'px'; //перемещаем див
            }

            timer = setTimeout(frame, 1000 / fps);
        }, 1000 / fps);
    }

    document.getElementById('more_button').onclick = function() {
        create_cube(1, randomizer(30,60), randomizer(30,60));
    };

    start();
};
