# Một số lưu ý

1. Trước khi bắt đầu cầu, mọi người nhớ check xem mình đã ở đúng branch chưa: `git branch`. Nếu chưa đúng thì `git checkout <branch>`
2. Pull code từ branch đó về
3. Code xong nhớ commit lại

----

## Các branch hiện tại

- ui_citizens: Code ui cho phân hệ dân
- ui_district_ward: Code ui cho phường và quận
- ui_department: Code ui cho sở

## Dùng maps

Mn tham khảo cái file testmap.html nha
Các bước dùng như sau:

1. Chèn cái script này ở dưới trong tag `body`

    ```html
        <script>
                ((g) => {
                    var h,
                        a,
                        k,
                        p = "The Google Maps JavaScript API",
                        c = "google",
                        l = "importLibrary",
                        q = "__ib__",
                        m = document,
                        b = window;
                    b = b[c] || (b[c] = {});
                    var d = b.maps || (b.maps = {}),
                        r = new Set(),
                        e = new URLSearchParams(),
                        u = () =>
                            h ||
                            (h = new Promise(async (f, n) => {
                                await (a = m.createElement("script"));
                                e.set("libraries", [...r] + "");
                                for (k in g)
                                    e.set(
                                        k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
                                        g[k]
                                    );
                                e.set("callback", c + ".maps." + q);
                                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                                d[q] = f;
                                a.onerror = () => (h = n(Error(p + " could not load.")));
                                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                                m.head.append(a);
                            }));
                    d[l]
                        ? console.warn(p + " only loads once. Ignoring:", g)
                        : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
                })({ key: "AIzaSyDHXDgbPJoFPySLuavImK6VfrMOsAeZX9o", v: "beta" });
            </script>
             <script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
    ```

2. Chèn một div cho map. Chỉnh sửa cái width vs height cho phù hợp là được

    ```html
        <div class="map-container" style="width: 100%; height: 100% ">
            <div id="map"></div>
        </div>
    ```

3. Chèn link css và script map

    ```html
        <link rel="stylesheet" href="/public/css/maps.css">
        <script type="module" defer src="/public/js/maps.js"></script>
    ```
