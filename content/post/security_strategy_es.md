---
title: "Hacia un enfoque holístico de la seguridad de los contenedores: una estrategia"
description: Build a strategic approach to container security.
date: 2022-01-03T09:21:56Z
draft: false
author: Davide Barbato
tags: [security]
---

Los contenedores se han convertido en el estándar de facto para servir aplicaciones modernas en nube nativa. Estan presentes tanto si se proporciona un servicio a terceros como si se utilizan internamente.

En el informe [state of DevOps 2021](https://services.google.com/fh/files/misc/state-of-devops-2021.pdf) elaborado por Google, se revela que el 40 % de las empresas encuestadas se encuentran en la categoría alta en lo respectivo a la adopción de prácticas DevOps. Esto significa que, la empresa es capaz de desplegar a un entorno productivo con una frecuencia de entre una vez a la semana y una vez al mes, la empresa es capaz de llevar un cambio del entorno de staging al entorno productivo en un intervalo de tiempo de un dia a una semana, la empresa es capaz de recuperar su servicios tra una caída en menos de un día y el porcentaje de errores que produzcan degradaciones del servicio es de entre el 16% y el 30%. El número de empresas en categoría alta ha aumentado un 23% desde el año pasado, mientras que la categoría media se ha reducido del 44% al 28%. Todo esto significa que hay una clara apuesta por la automatización para mejorar la capacidad de entregar software con más velocidad y mejor estabilidad.

Para destacar otro dato, en la [Encuesta CNFC del 2020](https://www.cncf.io/wp-content/uploads/2020/11/CNCF_Survey_Report_2020.pdf), se detalla que el 92% de las empresas están utilizando contenedores en producción, lo que supone un aumento del 300% desde 2016.

La seguridad, por otro lado, no ha visto un aumento significativo en sus números. Este es el resultado lógico de una industria que se ha centrado en acelerar el desarrollo, a menudo sin dar importancia a si las cosas se rompen, ya que pueden ser rápidamente corregidas mediante sistemas de recuperación rápida y roll-back ("romper temprano, romper rápido"). Mientras tanto, la ciberseguridad es un juego intrínsecamente proactivo, en el que el análisis y las opciones de diseño necesarias deben realizarse antes de empezar a desarrollar, lo que ralentiza el proceso de desarrollo; algo que la mayoría de las empresas no están dispuestas a sacrificar en nombre de una base de código más segura y robusta.

Para satisfacer estas nuevas necesidades, los entusiastas de la ciberseguridad no tardaron en idear formas de llenar este vacío: herramientas para escanear imágenes de contenedores, auditar la configuración del clúster o auditar el acceso a la red... Estos son sólo un puñado de los muchos intentos de inyectar seguridad en el flujo de trabajo de DevOps, tratando de minimizar la fricción y reducir el tiempo de despliegue, al tiempo que se añade seguridad al producto y se equilibra dicha seguridad con la velocidad.

Aunque hay una cantidad increíble de herramientas que tratan de garantizar la proteccion de los servicios basados en contenedores, sigue faltando una estrategia clara en torno a la aplicación coherente de medidas defensivas para prevenir y detectar comportamientos no deseados.

No es ningún secreto que los incidentes basados en contenedores van en aumento: basándonos en dos informes, el [Red Hat State of Kubernetes Security 2021 Report](https://www.redhat.com/rhdc/managed-files/cl-state-kubernetes-security-report-ebook-f29117-202106-en_0.pdf) y el [Tripwire State of Container Security Report](https://www.tripwire.com/solutions/devops/tripwire-dimensional-research-state-of-container-security-report-register) (2019), podemos ver claramente las cifras en torno a este fenómeno: en el primero se informa de que el 94% de los encuestados afirma haber tenido al menos un incidente de seguridad relacionado con contenedores, mientras que en el segundo, el 60% de los encuestados informó respondió haber tenido al menos un incidente de seguridad.

![](/images/security_strategy/tripwire_incidents.png "Tripwire Report - Incidents")

La coherencia proviene de una estrategia clara, que contemple la seguridad del producto desde un punto de vista holístico: los frameworks son especialmente buenos para establecer, lograr y mantener dicha estrategia si se aplican correctamente.

Hay un montón de frameworks centrados en la seguridad, el problema es que no siempre es fácil aplicarlos a las últimas tecnologías, por un lado porque son frameworks de alto nivel que no tienen en cuenta los detalles de implementación, y por otro porque los contenedores requieren un enfoque de seguridad diferente al de las infraestructuras tradicionales. La falta de experiencia en esta área está comenzando a ser un problema.

El [NIST](https://www.nist.gov/), el Instituto Nacional de Normas y Tecnología, ha realizado un gran trabajo estableciendo normas en todos los ámbitos de la seguridad de la información: desde la aplicación hasta la gestión de riesgos, pasando por la seguridad física y los controles.
En concreto, lo que haremos en este artículo es mapear el Marco de Seguridad Cibernética (CSF) del NIST con el mundo de los contenedores para dar un primer paso hacia una estrategia de seguridad de contenedores consistente.

![](/images/security_strategy/nist_csf.png "NIST Cyber Security Framework")

Daremos una visión general de cada categoría del CSF y de cómo podemos trasladarlos al mundo de los contenedores, dando algunos consejos sobre cómo abordarlos. Luego nos centraremos en cada aspecto con más detalle en los siguientes artículos.

## Identificación
No se puede proteger lo que no se conoce, por eso la visibilidad es clave en toda organización: es la base de toda estrategia de seguridad exitosa. Esta función del marco se centra en identificar todos los riesgos potenciales a los que se enfrenta una empresa, desde la gestión de activos hasta la gestión de riesgos, pasando por el entorno empresarial, la gobernanza y la evaluación de riesgos.

En cuanto a la gestión de activos, desde que la virtualización despegó hace una década o más, la visibilidad ha sido un problema: ¿cómo proteger los hosts que se ejecutan dentro de otros, que abstraen, y hacen transparentes las actividades operativas como la orquestación?  ¿cómo proteger hosts en los que parte de la infraestructura es efímera por naturaleza?

Esta ha sido una pregunta difícil de responder, y todavía no hay una solución única: realmente depende de su pila tecnológica en cuanto a cómo enumerar correctamente todos sus activos.

Probablemente para nosotros, hay algunos consejos que pueden ayudarnos a avanzar en la consecución de una visibilidad completa, uno sobre todo: el logging.

A continuación, un extracto del informe de Dynatrace [Securing Containers and Modern Cloud Infrastructure ebook](https://www.dynatrace.com/monitoring/resources/ebooks/the-maturation-of-cloud-native-security/) sobre la mayoría de los aspectos que carecen de visibilidad:

![](/images/security_strategy/visibility.png "Dynatrace Report - Visibility")

Es primordial crear una estrategia de logging para garantizar que los logs:
- Se recojan en una ubicación central para proporcionar un *único panel de vidrio;*
- Se exporten de manera oportuna para reducir los puntos ciegos;
- Contengan suficiente información para identificar rápidamente el origen de la actividad, ya sea un pod, un contenedor, una aplicación o un servicio;
- Proporcionen suficiente información para responder a la pregunta: ¿quién hizo qué, cuándo y cómo?

Los logs de la API de Kubernetes pueden indicar cuándo se despliega o destruye un nuevo contenedor. Los agentes que exportan logs y métricas del sistema a una ubicación central (es decir, [DataDog](https://www.datadoghq.com/), [fluentd](https://www.fluentd.org/), [rsyslog](https://www.rsyslog.com/)) pueden instalarse en cada contenedor. Estos son sólo dos consejos que deberían tenerse en cuenta a la hora de crear una estrategia de registro exhaustiva.

## Protección
La protección en ciberseguridad significa sobre todo crear un entorno seguro, con las salvaguardas adecuadas, en el que se ejecutarán tus cargas de trabajo: es la línea de base de seguridad que estás proporcionando a tus sistemas, y puede ser en forma de configuraciones tanto aplicativas como operativas.

Hay que prestar especial atención a la configuración segura: según el informe State of Kubernetes Security de Red Hat, una de las principales fuentes de incidentes de seguridad es la mala configuración.

![](/images/security_strategy/incidents_redhat.png "RedHat - Incidents")

Las políticas relajadas, las cuentas con privilegios ilimitados y el acceso irrestricto a la red (por nombrar sólo algunos) son ejemplos de configuraciones que no protegen adecuadamente sus servicios. Dado que las configuraciones rara vez cambian en tiempo de ejecución (por lo tanto, son inmutables), pueden ser auditadas. Una auditoría de las configuraciones puede ayudarnos a detectar fallos de seguridad durante el proceso de desarrollo y despliegue, dándonos la oportunidad de aplicar medidas correctivas.

Los siguientes datos del ya mencionado informe de Dynatrace muestran el impacto derivado de la mala configuración de las cargas de trabajo: el acceso no autorizado a las aplicaciones y a los datos supone el 40%, seguido del impacto en el SLA (39%) y el malware (38%). Esto supone una gran responsabilidad desde el punto de vista legal: la primera debe ser tratada bajo el marco legal del país (por ejemplo, la notificación de violaciones del GDPR) mientras que la segunda debe responder a los contratos de los clientes.

![](/images/security_strategy/threats.png "Dynatrace Report - Threats")

Asegurarse de que las desconfiguraciones se detectan en una fase temprana es clave para proporcionar un entorno seguro y fiable, y aquí es donde encaja el movimiento `shift security left`: comprobando los problemas de seguridad en una fase temprana del desarrollo, una empresa podría proteger adecuadamente sus servicios antes de que salgan al mercado, evitando exponer vulnerabilidades críticas que pueden causar bastantes estragos, como muestran los datos.

Hay múltiples formas de conseguir una línea de base segura. Si nos fijamos en el lado de los contenedores, se puede empezar por crear una imagen de contenedor base, llamada *Golden image*, que cumpla con los estándares de seguridad (por ejemplo, CIS) y asegurarse de que no sea manipulada (gracias a las comprobaciones de integridad de la imagen del contenedor), además de garantizar que cualquier capa adicional no socave la seguridad de la imagen.

En resumen: empiece a proteger su fase de desarrollo inyectando comprobaciones de seguridad en una fase temprana del proceso de desarrollo. Las *Golden image*, el análisis de código estático de las aplicaciones, la auditoría de la infraestructura como código, las comprobaciones de las dependencias y los linters, son todas estrategias válidas para detectar y arreglar los problemas de seguridad con antelación, y ofrecer configuraciones seguras por defecto.

## Detección y respuesta
Yendo más allá, el informe de Dynatrace nos desglosa los incidentes más comunes que experimentaron las empresas en 2020:

![](/images/security_strategy/incidents_dynatrace.png "Dynatrace Report - Incidents")

Como se detalla en el gráfico anterior, la mera prevención no basta: de los cinco incidentes principales, sólo uno podría haberse evitado gracias a las medidas de prevención, mientras que los otros cuatro se habrían detectado en tiempo de ejecución.

Para respaldar esta afirmación, los siguientes gráficos de RedHat ponen de manifiesto la necesidad de una mayor protección en tiempo de ejecución, es decir, cuando se despliegan las cargas de trabajo y se debe supervisar la actividad en busca de comportamientos sospechosos.

![](/images/security_strategy/runtime_01.png "RedHat Report - Runtime Detection")


![](/images/security_strategy/runtime_02.png "RedHat Report - Runtime Detection")

Un asombroso 98% de los encuestados afirmó que la detección/respuesta de amenazas en tiempo de ejecución es algo que una empresa debería considerar definitivamente, como algo necesario o agradable de tener.

El informe de Tripwire arroja resultados similares:

![](/images/security_strategy/runtime_03.png "Tripwire Report - Runtime Detection")

Las cuatro primeras caen dentro de las capacidades de `Detección y respuesta`, que una vez más resulta ser el aspecto más importante de un sólido programa de seguridad de contenedores.

Las aplicaciones se han vuelto cada vez más complejas y dinámicas: ahora existe un ecosistema de herramientas diseñadas para el escalado, el proxy, el almacenamiento en caché y más, y cada una de ellas introduce potencialmente problemas de seguridad, haciendo que la superficie de ataque sea cada vez más amplia.

En un entorno así, el control sólo puede llegar hasta cierto punto. Se necesita una capacidad de detección y respuesta consistente y exhaustiva: mientras que el origen de la brecha puede pasar desapercibido, al interactuar con los sistemas comprometidos, siempre se generará un rastro de acciones, y es entonces cuando entra en juego la detección.

Varias investigaciones han cuantificado no sólo el tiempo que se tarda de media en identificar una brecha, sino también su coste.
Por tanto, es fundamental detectar la brecha lo antes posible, no sólo para minimizar el alcance y el impacto del evento, sino también para minimizar los costes.

Los retos a los que se enfrenta la aplicación de una estrategia de detección y respuesta son múltiples, y están estrictamente relacionados con la estrategia de logging construida entorno al producto: ser capaz de responder a la pregunta de `quién, qué, cuándo y cómo` proporcionará la información adecuada para detectar y responder a la actividad sospechosa.

Aunque ambos comparten los mismos retos, la detección y la respuesta añaden los suyos propios:
- Cortar el ruido para seleccionar sólo los eventos significativos sobre los que alertar;
- Detectar y responder a tiempo;

Mientras que la eliminación del ruido es específica de cada entorno, la detección y la respuesta a tiempo tienen una única solución: la automatización. Automatizar al máximo las fases de D&R proporcionará procesos repetibles y auditables que garantizan la coherencia y la rapidez.
Eso no es todo: preparar playbooks con diferentes escenarios de ataque le preparará para afrontar la situación a fondo, minimizando el pánico y el caos.

Las plataformas de orquestación de contenedores proporcionan APIs que pueden aprovecharse para, por ejemplo, destruir contenedores maliciosos, bloquear el tráfico de red o aislar los sistemas infectados, y deben integrarse en la estrategia de respuesta.

Pero tener lista de acciones y la creacion de herramientas en torno a ellas no es suficiente si se prueban una sola vez: en los escenarios de casos reales, pocas cosas salen como se espera, y una pequeña desviación puede cambiar la situación drásticamente. Por eso es importante establecer pruebas periódicas de los playbooks y del plan de respuesta a incidentes en su conjunto: con la ayuda de simulaciones puede asegurarse de que su empresa está preparada para afrontar cualquier situación de crisis derivada de una brecha de seguridad, posicionando a su equipo por delante de la curva y siendo capaz de manejar el incidente con el menor impacto posible.

Se puede empezar con algo pequeño: utilizar evaluaciones de seguridad sencillas con herramientas como [kube-bench](https://github.com/aquasecurity/kube-bench) o [kubesploit](https://github.com/cyberark/kubesploit) como parte de la evaluación regular, mientras que herramientas como [falco](https://falco.org/) se pueden utilizar para detectar la actividad maliciosa dentro un clúster de kubernetes en tiempo real, trabajando en lugar de o junto con una solución de logging centralizada.

## Recuperación
Un sistema verdaderamente seguro es aquel que es capaz de recuperarse en caso de que se produzcan desastres, como la caída de la región de su proveedor de alojamiento o como consecuencia de un ataque de seguridad distruptivo (por ejemplo, [ransomware](https://en.wikipedia.org/wiki/Ransomware)).

Por muy preparado que esté, o por muy rápido que responda a una situación de crisis, puede enfrentarse a graves daños que pueden poner en peligro su negocio. Por lo tanto, es importante incorporar la resiliencia en todos los aspectos de su negocio, y especialmente en el mundo de los contenedores.

No hay ningún consejo especial en este caso: se aplican los mismos conceptos de siempre, y plataformas como kubernetes han supuesto un gran avance en la ejecución de sistemas escalables y de alta disponibilidad capaces de resistir picos de carga y cortes.

Las soluciones multi-cloud son el camino para lograr una gran resiliencia, y de hecho están obteniendo más seguimiento a la luz de eventos como el reportado anteriormente: la comprensión del valor y la necesidad de construir resiliencia en sus ofertas está empujando las soluciones en el camino correcto para lograrlo.

Sería un error no mencionar las copias de seguridad. Hacer copias de seguridad de los datos importantes es uno de esos viejos consejos: siempre es pertinente.
Hacer copias de seguridad con frecuencia y probarlas regularmente garantiza que lo mas importante esté siempre a salvo, pudiendose restaurar en caso de necesidad. Asegúrese de restringir y supervisar el acceso, algo muy valioso para la respuesta a incidentes.

Sin embargo, es importante tomarse el tiempo necesario para establecer un proceso de seguimiento en caso de un evento tan dramático, similar al plan de respuesta a incidentes mencionado en la sección anterior. Disponer de un plan de recuperación de desastres y probarlo con regularidad hará que se desarrollen los músculos necesarios para responder con rapidez en situaciones de crisis.

Por último, pero no por ello menos importante: las pruebas hay que hacerlas con regularidad. El hecho de que haya funcionado una vez no garantiza que vaya a funcionar de nuevo. Es mejor tener la la seguridad de que si mañana ocurre algo malo, su empresa va a poder recuperarse con el menor daño posible y en el menor tiempo posible.

La alta disponibilidad (entre regiones y en varias nubes), combinada con una estrategia de copias de seguridad minuciosa junto con un sólido plan de recuperación de desastres es un buen comienzo para abordar y crear resiliencia en tu empresa.

## Conclusiones
Identificar, Proteger, Detectar, Responder y Recuperar son los elementos clave de una estrategia de seguridad exhaustiva que puede impulsar la seguridad sin sacrificar la innovación.

Adaptar este marco al creciente uso de contenedores es fundamental para crear plataformas seguras.

Basándonos en los informes mostrados en este artículo, está claro que una mezcla de medidas de prevención y detección es clave para conseguir un programa de seguridad de contenedores sólido y maduro: es imposible conseguir una seguridad perfecta, especialmente en un entorno tan dinámico como el de los contenedores. Debemos asumir que se introducirán vulnerabilidades en nuestro entorno de producción, ya sea a través de alguna configuración errónea, de una vulnerabilidad de la cadena de suministro (¿alguien se acuerda de log4j?) o simplemente de fallos en el código. Lo que realmente eleva los costes es la cantidad de tiempo que una brecha pasa sin ser detectada y erradicada.

Por eso, en Astrokube, seguimos diciendo:
> La protección es imprescindible. La detección es primordial.


¿Cómo lograrlo? Abordando el problema desde múltiples ángulos: construyendo servicios resistentes y escalables de alta disponibilidad, proporcionando una detección y respuesta oportuna a las amenazas, fomentando una cultura de seguridad en la que se establezca una mejor colaboración entre todos los ingenieros con la ayuda de herramientas de código abierto, y cambiando la seguridad en una fase más temprana del proceso de desarrollo para asegurarse de que se está construyendo la seguridad desde el principio.

Pero no hay que equivocarse: la seguridad es un esfuerzo conjunto de todos los principales departamentos de ingeniería: Operaciones, Desarrollo, Seguridad (cuando la experiencia en seguridad no está integrada directamente en los equipos), todos ellos tienen que colaborar para que la seguridad sea transparente y en beneficio de los demás (y no sea un blocker).

Por último, veamos cómo se integra la seguridad en el proceso DevOps:

![](/images/security_strategy/last.png "DevSecOps initiative")

El 49% dice que está comenzando, o ya ha comenzado su viaje de DevSecOps, mientras que el 26% informa de la desconexión entre Sec y DevOps. Esto significa: si estás en ese 49%, ¡felicidades! El primer paso es fundamental y cuanto más sigas avanzando más crecerás, para acabar finalmente en ese 25% con un estado avanzado.
Si estás en el 26%, deberías empezar a pensar seriamente en ello, o corres el riesgo de quedarte atrás.

Tanto si está en el 28, 49 o 25 por ciento, Astrokube le guiará en el camino hacia una estrategia de seguridad de contenedores más sólida y consistente.

En las próximas semanas, publicaremos más contenido orientado a la seguridad para mostrar cómo puede lograr una estrategia de seguridad estable y madura para hacer que sus cargas de trabajo sean más seguras, más estables y más resistentes.

Nos vemos pronto.
