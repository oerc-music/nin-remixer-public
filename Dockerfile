
FROM node:10.15

WORKDIR /home/node/app

COPY ./package* ./

RUN npm install 

COPY . .

EXPOSE 4000

CMD npm start

# To build:
#
# docker build -t nin-remixer .
#
# To run:
# docker run -p 4000:4000 -it --rm nin-remixer
